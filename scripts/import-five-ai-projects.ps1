param(
    [string]$BaseUrl = 'https://aiproject-dr.ru/five-ai-projects'
)

$ErrorActionPreference = 'Stop'
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
        [Parameter(Mandatory = $true)][string]$Value,
        [int]$MaxAttempts = 5
    )

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            Set-Content -Path $Path -Value $Value -Encoding UTF8
            return
        }
        catch {
            if ($attempt -eq $MaxAttempts) { throw }
            Start-Sleep -Milliseconds (200 * $attempt)
        }
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot

$exampleRoot = Join-Path $repoRoot 'examples/sites/aiproject-dr-five-ai-projects'
$sourceDir = Join-Path $exampleRoot 'source'
$exampleSpecsDir = Join-Path $exampleRoot 'specs'
$librarySpecsDir = Join-Path $repoRoot 'specs/technical-assignments'
$templateDir = Join-Path $repoRoot 'templates/site-layouts/five-ai-projects-template'

$assetDir = Join-Path $sourceDir 'assets'
$templateAssetDir = Join-Path $templateDir 'assets'

$downloadMap = @(
    @{ Url = "$BaseUrl/"; Target = (Join-Path $sourceDir 'index.html') },
    @{ Url = "$BaseUrl/styles.css"; Target = (Join-Path $sourceDir 'styles.css') },
    @{ Url = "$BaseUrl/app.js"; Target = (Join-Path $sourceDir 'app.js') },
    @{ Url = "$BaseUrl/docs-bundle.js"; Target = (Join-Path $sourceDir 'docs-bundle.js') },
    @{ Url = "$BaseUrl/assets/markdown-it.min.js"; Target = (Join-Path $assetDir 'markdown-it.min.js') },
    @{ Url = "$BaseUrl/assets/purify.min.js"; Target = (Join-Path $assetDir 'purify.min.js') }
)

New-Item -ItemType Directory -Force -Path $sourceDir, $assetDir, $exampleSpecsDir, $librarySpecsDir, $templateDir, $templateAssetDir | Out-Null

foreach ($entry in $downloadMap) {
    Invoke-WebRequest -Uri $entry.Url -OutFile $entry.Target
}

$docsBundlePath = Join-Path $sourceDir 'docs-bundle.js'
$docsRaw = Get-Content -Raw -Encoding UTF8 -Path $docsBundlePath

$docsMatch = [Regex]::Match($docsRaw, 'window\.TZ_DOCS\s*=\s*(\{.*\})\s*;\s*$', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $docsMatch.Success) {
    throw 'Failed to locate window.TZ_DOCS object in docs-bundle.js'
}

$json = $docsMatch.Groups[1].Value
$docsObject = $json | ConvertFrom-Json
$specCount = @($docsObject.PSObject.Properties).Count

foreach ($property in $docsObject.PSObject.Properties) {
    $name = $property.Name
    $text = Repair-Mojibake ([string]$property.Value)
    Write-Utf8WithRetry -Path (Join-Path $exampleSpecsDir $name) -Value $text
    Write-Utf8WithRetry -Path (Join-Path $librarySpecsDir $name) -Value $text
}

Copy-Item -Path (Join-Path $sourceDir 'index.html') -Destination (Join-Path $templateDir 'index.html') -Force
Copy-Item -Path (Join-Path $sourceDir 'styles.css') -Destination (Join-Path $templateDir 'styles.css') -Force
Copy-Item -Path (Join-Path $sourceDir 'app.js') -Destination (Join-Path $templateDir 'app.js') -Force
Copy-Item -Path (Join-Path $sourceDir 'docs-bundle.js') -Destination (Join-Path $templateDir 'docs-bundle.js') -Force
Copy-Item -Path (Join-Path $assetDir 'markdown-it.min.js') -Destination (Join-Path $templateAssetDir 'markdown-it.min.js') -Force
Copy-Item -Path (Join-Path $assetDir 'purify.min.js') -Destination (Join-Path $templateAssetDir 'purify.min.js') -Force

Write-Host 'Import completed.'
Write-Host "Source URL: $BaseUrl/#projects"
Write-Host "Specs updated: $specCount files"
Write-Host "Source: $sourceDir"
Write-Host "Template: $templateDir"
