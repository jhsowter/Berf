New-Item -ItemType Directory "lib" -ErrorAction Ignore
New-Item -ItemType Directory ".\Content\Scripts\" -ErrorAction Ignore
Copy-Item "..\Berf\bin\Release\Berf.dll" ".\lib"
Copy-Item "..\BerfWeb\Scripts\Berf\Berf*.js" ".\Content\Scripts\"
nuget pack Package.nuspec