$URL='http://127.0.0.1:54321'
$KEY='sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
$UID='00000000-0000-0000-0000-000000000001'
$h=@{ 'apikey'=$KEY; 'Authorization'="Bearer $KEY"; 'Prefer'='return=representation' }

function PostAndCheck($table, $payload){
  $body = $payload | ConvertTo-Json -Depth 6
  Write-Output "--- POST $table ---"
  try {
    $res = Invoke-RestMethod -Method Post -Uri "$URL/rest/v1/$table" -Headers $h -Body $body -ContentType 'application/json'
    Write-Output ($res | ConvertTo-Json -Depth 6)
    return $res
  } catch {
    Write-Output ('ERROR POST ' + $table + ': ' + ($_ | Out-String))
    return $null
  }
}

function PatchAndCheck($table, $id, $payload){
  $body = $payload | ConvertTo-Json -Depth 6
  Write-Output "--- PATCH $table id=$id ---"
  try {
    $uri = $URL + '/rest/v1/' + $table + '?id=eq.' + [string]$id
    $res = Invoke-RestMethod -Method Patch -Uri $uri -Headers $h -Body $body -ContentType 'application/json'
    Write-Output ($res | ConvertTo-Json -Depth 6)
    return $res
  } catch {
    Write-Output ('ERROR PATCH ' + $table + ': ' + ($_ | Out-String))
    return $null
  }
}

function DeleteCheck($table, $id){
  Write-Output "--- DELETE $table id=$id ---"
  try {
    $uri = $URL + '/rest/v1/' + $table + '?id=eq.' + [string]$id
    $res = Invoke-RestMethod -Method Delete -Uri $uri -Headers $h
    Write-Output "Deleted"
    return $true
  } catch {
    Write-Output ('ERROR DELETE ' + $table + ': ' + ($_ | Out-String))
    return $false
  }
}

# Helper: safely extract an id from a response that can be an array or object
function GetIdFromResponse($res) {
  if ($null -eq $res) { return $null }
  if ($res -is [System.Collections.IEnumerable] -and -not ($res -is [string])) {
    foreach ($item in $res) {
      if ($item.id) { return $item.id }
    }
  } elseif ($res.id) {
    return $res.id
  }
  return $null
}

# Future Vision
$f = PostAndCheck 'future_visions' @{ user_id=$UID; ideal_future_description='test future vision'; one_year_goals=@(@{goal='g';steps='s';target_date='2026-12-31'}); three_year_goals=@(@{goal='g3';steps='s3';target_date='2027-12-31'}) }
if ($f -ne $null) {
  $fid = GetIdFromResponse $f
  if ($fid) { PatchAndCheck 'future_visions' $fid @{ ideal_future_description='updated future vision' }; DeleteCheck 'future_visions' $fid } else { Write-Output 'Could not extract id from future_visions POST response' }
}

# Weekly Planning
$w = PostAndCheck 'weekly_plannings' @{ week_start_date=(Get-Date).ToString('yyyy-MM-dd'); user_id=$UID; purpose_aligned_action='test action' }
if ($w -ne $null) {
  $wid = GetIdFromResponse $w
  if ($wid) { PatchAndCheck 'weekly_plannings' $wid @{ purpose_aligned_action='updated action' }; DeleteCheck 'weekly_plannings' $wid } else { Write-Output 'Could not extract id from weekly_plannings POST response' }
}

# Monthly Vision
$m = PostAndCheck 'monthly_visions' @{ month=((Get-Date).ToString('yyyy-MM')); user_id=$UID; ideal_month_vision='test month vision' }
if ($m -ne $null) {
  $mid = GetIdFromResponse $m
  if ($mid) { PatchAndCheck 'monthly_visions' $mid @{ ideal_month_vision='updated month vision' }; DeleteCheck 'monthly_visions' $mid } else { Write-Output 'Could not extract id from monthly_visions POST response' }
}

# Daily Page
$d = PostAndCheck 'daily_pages' @{ date=(Get-Date -Format yyyy-MM-dd); user_id=$UID; day_message='test day message' }
if ($d -ne $null) {
  $did = GetIdFromResponse $d
  if ($did) { PatchAndCheck 'daily_pages' $did @{ day_message='updated day message' }; DeleteCheck 'daily_pages' $did } else { Write-Output 'Could not extract id from daily_pages POST response' }
}

Write-Output 'ALL TESTS DONE'
