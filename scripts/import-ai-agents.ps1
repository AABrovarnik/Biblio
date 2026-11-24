param(
  [string]$BaseUrl = 'https://aiproject-dr.ru/ai-agents/'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Repair-Mojibake {
  param([string]$Text)

  if ($null -eq $Text) { return $Text }

  $enc1251 = [System.Text.Encoding]::GetEncoding(1251)
  $encUtf8 = [System.Text.Encoding]::UTF8
  $fixed = $encUtf8.GetString($enc1251.GetBytes($Text))

  $oldCyrillic = ([Regex]::Matches($Text, '[\u0400-\u04FF]')).Count
  $newCyrillic = ([Regex]::Matches($fixed, '[\u0400-\u04FF]')).Count

  if ($newCyrillic -gt $oldCyrillic) {
    return $fixed
  }

  return $Text
}

function Write-Utf8WithRetry {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][AllowEmptyString()][string[]]$Lines,
    [int]$MaxAttempts = 5
  )

  for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    try {
      Set-Content -Path $Path -Value $Lines -Encoding UTF8
      return
    }
    catch {
      if ($attempt -eq $MaxAttempts) { throw }
      Start-Sleep -Milliseconds (200 * $attempt)
    }
  }
}

$root = Split-Path -Parent $PSScriptRoot
$work = Join-Path $root '.tmp-import-ai-agents'
$exampleRoot = Join-Path $root 'examples/sites/aiproject-dr-ai-agents/source'
$ideasFile = Join-Path $root 'ideas/future/ai-agents-catalog.md'

if (Test-Path $work) {
  Remove-Item $work -Recurse -Force
}

New-Item -ItemType Directory -Path $work -Force | Out-Null

try {
  $files = @(
    @{ Url = $BaseUrl; Path = 'index.html' },
    @{ Url = "${BaseUrl}styles.css"; Path = 'styles.css' },
    @{ Url = "${BaseUrl}script.js"; Path = 'script.js' },
    @{ Url = "${BaseUrl}data.js"; Path = 'data.js' }
  )

  foreach ($f in $files) {
    $out = Join-Path $work $f.Path
    New-Item -ItemType Directory -Path ([System.IO.Path]::GetDirectoryName($out)) -Force | Out-Null
    Invoke-WebRequest -Uri $f.Url -OutFile $out
  }

  New-Item -ItemType Directory -Path $exampleRoot -Force | Out-Null
  Copy-Item (Join-Path $work 'index.html') (Join-Path $exampleRoot 'index.html') -Force
  Copy-Item (Join-Path $work 'styles.css') (Join-Path $exampleRoot 'styles.css') -Force
  Copy-Item (Join-Path $work 'script.js') (Join-Path $exampleRoot 'script.js') -Force
  Copy-Item (Join-Path $work 'data.js') (Join-Path $exampleRoot 'data.js') -Force

  $raw = Get-Content (Join-Path $work 'data.js') -Raw -Encoding UTF8
  $json = $raw -replace '^window\.AGENTS\s*=\s*', '' -replace ';\s*$', ''
  $agents = $json | ConvertFrom-Json

  $sectionMap = @{
    front = 'B2B Front Office'
    back = 'B2B Back Office'
    personal = 'B2C / Personal'
  }

  $lines = @()
  $lines += '# Future ideas: 50 AI agents'
  $lines += ''
  $lines += "Source: $BaseUrl"
  $lines += ''
  $lines += "Snapshot date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  $lines += ''

  foreach ($section in @('front', 'back', 'personal')) {
    $group = $agents | Where-Object { $_.section -eq $section } | Sort-Object number
    $lines += "## $($sectionMap[$section])"
    $lines += ''
    foreach ($agent in $group) {
      $safeTitle = Repair-Mojibake ([string]$agent.title)
      $lines += "$($agent.number). $safeTitle"
    }
    $lines += ''
  }

  $lines += '## Usage in Biblio'
  $lines += ''
  $lines += '- pick one idea and convert it into a dedicated spec in `specs/technical-assignments/`;'
  $lines += '- store prototyping prompts in `prompts/`;'
  $lines += '- save implementation patterns in `skills/` and `references/`;'
  $lines += '- maintain a separate shortlist for near-term MVPs next to this catalog.'

  Write-Utf8WithRetry -Path $ideasFile -Lines $lines
  Write-Host "Import completed successfully. Ideas extracted: $($agents.Count)"
}
finally {
  if (Test-Path $work) {
    Remove-Item $work -Recurse -Force
  }
}
