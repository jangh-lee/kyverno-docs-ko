(function () {
  var KEY = 'sidebar-hidden'
  var root = document.documentElement
  function saved() { try { return localStorage.getItem(KEY) === '1' } catch (e) { return false } }
  function save(v) { try { localStorage.setItem(KEY, v ? '1' : '0') } catch (e) {} }
  function apply(hidden) {
    if (hidden) root.setAttribute('data-sidebar', 'hidden')
    else root.removeAttribute('data-sidebar')
    var b = document.querySelector('.sidebar-toggle')
    if (b) {
      b.setAttribute('aria-expanded', String(!hidden))
      b.setAttribute('aria-label', hidden ? '목차 열기' : '목차 닫기')
      b.title = hidden ? '목차 열기' : '목차 닫기'
    }
  }
  apply(saved()) // 깜빡임을 줄이려고 가능한 한 일찍 적용
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.sidebar-toggle') || !document.querySelector('.sidebar-pane')) return
    var b = document.createElement('button')
    b.className = 'sidebar-toggle'
    b.type = 'button'
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
    b.addEventListener('click', function () {
      var hidden = root.getAttribute('data-sidebar') !== 'hidden'
      apply(hidden); save(hidden)
    })
    document.body.appendChild(b)
    apply(saved())
  })
})()
