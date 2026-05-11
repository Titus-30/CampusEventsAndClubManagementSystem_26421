# Fix BOM in all Java files
$javaFiles = Get-ChildItem -Recurse -Filter *.java

foreach ($file in $javaFiles) {
    try {
        # Read content with UTF8 (includes BOM)
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        # Remove BOM if present
        $content = $content -replace '^\uFEFF', ''
        
        # Write back without BOM using UTF8
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
    }
    catch {
        Write-Host "Error fixing: $($file.FullName)" -ForegroundColor Red
    }
}

Write-Host "Total files fixed: $($javaFiles.Count)" -ForegroundColor Cyan
