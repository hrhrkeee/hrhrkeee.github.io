// 共有言語スクリプト。CSS不要・依存なし。
// 言語設定は localStorage に保存し、セッションをまたいで保持する。
// 言語追加手順:
//   1. 対象ドキュメントに <code>.html を追加（例 privacy-policy/fr.html）
//   2. アプリトップの #docs の data-langs と、各ドキュメントの #langnav の data-langs に
//      {"code":"fr","label":"Français"} を追加するだけ。
(function () {
  var KEY = "preferredLang";

  var SiteLang = {
    get: function () {
      return localStorage.getItem(KEY) || "en";
    },
    set: function (code) {
      localStorage.setItem(KEY, code);
    },
  };

  // アプリトップページのドキュメント一覧 + 言語切替を描画。
  // <div id="docs"
  //      data-langs='[{"code":"en","label":"English"},{"code":"ja","label":"日本語"}]'
  //      data-docs='[{"title":"Privacy Policy","path":"privacy-policy"}]'></div>
  function renderDocs() {
    var el = document.getElementById("docs");
    if (!el) return;
    var langs = JSON.parse(el.dataset.langs);
    var docs = JSON.parse(el.dataset.docs);

    var cur = SiteLang.get();
    var has = langs.some(function (l) { return l.code === cur; });
    var lang = has ? cur : langs[0].code;

    var html = "<p>";
    html += langs
      .map(function (l) {
        return l.code === lang
          ? "<strong>" + l.label + "</strong>"
          : '<a href="#" data-lang="' + l.code + '">' + l.label + "</a>";
      })
      .join(" | ");
    html += "</p><ul>";
    docs.forEach(function (d) {
      html += '<li><a href="' + d.path + "/" + lang + '.html">' + d.title + "</a></li>";
    });
    html += "</ul>";
    el.innerHTML = html;

    el.querySelectorAll("[data-lang]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        SiteLang.set(a.dataset.lang);
        renderDocs();
      });
    });
  }

  // ドキュメントページの言語切替を描画し、閲覧中の言語を記憶。
  // <nav id="langnav"
  //      data-langs='[{"code":"en","label":"English"},{"code":"ja","label":"日本語"}]'
  //      data-current="en"></nav>
  function renderLangNav() {
    var el = document.getElementById("langnav");
    if (!el) return;
    var langs = JSON.parse(el.dataset.langs);
    var cur = el.dataset.current;
    SiteLang.set(cur);
    el.innerHTML = langs
      .map(function (l) {
        return l.code === cur
          ? "<strong>" + l.label + "</strong>"
          : '<a href="' + l.code + '.html">' + l.label + "</a>";
      })
      .join(" | ");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderDocs();
    renderLangNav();
  });

  window.SiteLang = SiteLang;
})();
