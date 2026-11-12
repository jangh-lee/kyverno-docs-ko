// 설명 문장(.hl-link)에 마우스를 올리거나 클릭하면 data-code가 가리키는 코드 블록의 data-lines 줄을 강조한다.
(function () {
  function blockByTitle(title) {
    var frames = document.querySelectorAll('.expressive-code')
    for (var i = 0; i < frames.length; i++) {
      var cap = frames[i].querySelector('figcaption')
      if (cap && cap.textContent.trim() === title) return frames[i]
    }
    return null
  }
  function parse(spec) {
    var set = {}
    spec.split(',').forEach(function (part) {
      var m = part.trim().split('-')
      var a = parseInt(m[0], 10), b = parseInt(m[1] || m[0], 10)
      for (var n = a; n <= b; n++) set[n] = true
    })
    return set
  }
  function clear() {
    document.querySelectorAll('.ec-line.hl-on').forEach(function (l) { l.classList.remove('hl-on') })
  }
  function show(el) {
    clear()
    var block = blockByTitle(el.getAttribute('data-code') || '')
    if (!block) return
    var want = parse(el.getAttribute('data-lines') || '')
    var lines = block.querySelectorAll('.ec-line')
    var first
    lines.forEach(function (l, i) {
      if (want[i + 1]) { l.classList.add('hl-on'); first = first || l }
    })
    return first
  }
  var pinned = null
  function init() {
    document.querySelectorAll('.hl-link').forEach(function (el) {
      el.addEventListener('mouseenter', function () { if (!pinned) show(el) })
      el.addEventListener('focus', function () { if (!pinned) show(el) })
      el.addEventListener('mouseleave', function () { if (!pinned) clear() })
      el.addEventListener('blur', function () { if (!pinned) clear() })
      el.addEventListener('click', function () {
        if (pinned === el) { pinned = null; el.classList.remove('hl-pinned'); clear(); return }
        if (pinned) pinned.classList.remove('hl-pinned')
        pinned = el; el.classList.add('hl-pinned')
        var first = show(el)
        if (first) first.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
    })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()
