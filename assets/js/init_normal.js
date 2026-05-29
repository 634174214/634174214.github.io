var giteeUrl = ASSETS_URL;
$LAB
  .script(giteeUrl + "libs/jquery-1.11.1.min.js").wait()
  .script(giteeUrl + "libs/layer/layer.js").wait()
  .script(giteeUrl + "libs/go-top.js").wait()
  .script(giteeUrl + "libs/storage.js")
  .script(giteeUrl + "js/public.js")