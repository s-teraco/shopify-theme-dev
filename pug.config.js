
const url = "https://campaign.cdedirect.co.jp/lifestyle_plan/point_t/";
const local_url = './';

const og_siteName = "";
const og_locale = "jp_JP";
const og_type = "website";
const twitter_card = "summary_large_image";
const twitter_site = "@";
const site_name = "　|　" + og_siteName;
const ogimg = "img/ogp.png";
const favicon = local_url + "favicon.ico";

/*
{
  name(string): 名前空間
  url(string): ページの絶対パス
  local_url(string): ページの相対パス（ルートパス）
  title(string): ページ一覧に表示されるページタイトル *ページ一覧ページにのみ使用
  level(number): 階層を指定 *ページ一覧ページにのみ使用
  state(string): ステータス *ページ一覧ページにのみ使用
},
*/
module.exports = {
  pages: [
    {
      name: "home",
      url: url,
      local_url: local_url,
      title: "トップページ",
      level: 0,
      state: "",
    },
  ],
  meta: {
    common_title: site_name,
    favicon: favicon,
    //- webclip: webclip,
    og_locale: og_locale,
    og_type: og_type,
    og_siteName: og_siteName,
    //- og_image: '',
    twitter_card: twitter_card,
    //- twitter_image: '',
    //- twitter_site: twitter_site
  },
  paths: {
    img: local_url + "images/",
    css: local_url + "css/",
    js: local_url + "js/",
    font: local_url + "font/",
    movie: local_url + "movie/",
  },
  links: {
    twitter: "#",
    facebook: "#",
    note: "#",
  },
};
