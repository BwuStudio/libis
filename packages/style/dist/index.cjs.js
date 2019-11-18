'use strict';



function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

___$insertStyle("@charset \"UTF-8\";\n/* http://meyerweb.com/eric/tools/css/reset/ \r\n   v2.0 | 20110126\r\n   License: none (public domain)\r\n*/\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block;\n}\n\nbody {\n  line-height: 1;\n}\n\nol, ul {\n  list-style: none;\n}\n\nblockquote, q {\n  quotes: none;\n}\n\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: \"\";\n  content: none;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n#searchResult {\n  display: none;\n}\n\n/* common style */\n* {\n  box-sizing: border-box;\n}\n\na {\n  text-decoration: none;\n}\n\nhtml, html body {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  font-size: 14px;\n}\n\n.globe, .panel {\n  height: 100%;\n  width: auto;\n  display: block;\n  position: relative;\n}\n\n.globe,\n.panel {\n  height: 100%;\n  width: auto;\n  display: block;\n  position: relative;\n  /* input-hook */\n  /* grid hook*/\n}\n.globe > .body,\n.panel > .body {\n  height: 100%;\n  width: 100%;\n  padding: 8px 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.globe.with_head,\n.panel.with_head {\n  padding-top: 33px;\n}\n.globe.with_head > .head,\n.panel.with_head > .head {\n  height: 33px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  border-bottom: 1px solid #ccc;\n  padding: 0 8px;\n}\n.globe.with_head > .head > .row,\n.panel.with_head > .head > .row {\n  display: block;\n  position: relative;\n  height: 32px;\n  padding: 3px 0;\n}\n.globe.with_head_row_1,\n.panel.with_head_row_1 {\n  padding-top: 33px;\n}\n.globe.with_head_row_1 > .head,\n.panel.with_head_row_1 > .head {\n  height: 33px;\n}\n.globe.with_head_row_2,\n.panel.with_head_row_2 {\n  padding-top: 65px;\n}\n.globe.with_head_row_2 > .head,\n.panel.with_head_row_2 > .head {\n  height: 65px;\n}\n.globe.with_head_row_3,\n.panel.with_head_row_3 {\n  padding-top: 97px;\n}\n.globe.with_head_row_3 > .head,\n.panel.with_head_row_3 > .head {\n  height: 97px;\n}\n.globe.with_foot,\n.panel.with_foot {\n  padding-bottom: 32px;\n}\n.globe.with_foot > .foot,\n.panel.with_foot > .foot {\n  height: 32px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 0 8px;\n}\n.globe.with_sider,\n.panel.with_sider {\n  margin-left: 240px;\n}\n.globe > .sider,\n.panel > .sider {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: -240px;\n  width: 240px;\n  background-color: #eff5fa;\n  border-right: 1px solid #aab6d0;\n}\n.globe.with_sider_right,\n.panel.with_sider_right {\n  margin-right: 320px;\n}\n.globe > .sider_right,\n.panel > .sider_right {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: -320px;\n  width: 320px;\n  background-color: #eff5fa;\n  border-left: 1px solid #aab6d0;\n}\n.globe .mini-datepicker,\n.panel .mini-datepicker {\n  width: 100%;\n  height: 26px;\n  line-height: 26px;\n}\n.globe .mini-buttonedit-border,\n.panel .mini-buttonedit-border {\n  height: 24px;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n}\n.globe .mini-buttonedit-border > input,\n.panel .mini-buttonedit-border > input {\n  line-height: 24px;\n  height: 24px;\n  font-size: 14px;\n}\n.globe .mini-buttonedit-button,\n.globe .mini-buttonedit-close,\n.panel .mini-buttonedit-button,\n.panel .mini-buttonedit-close {\n  height: 20px;\n}\n.globe .mini-buttonedit,\n.panel .mini-buttonedit {\n  display: inline-block;\n  height: 26px;\n  width: 100%;\n  /* float: left; */\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  background: #eff5fa;\n}\n.globe .mini-grid-pager,\n.panel .mini-grid-pager {\n  background: #eff5fa;\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  vertical-align: middle;\n}\n.globe .mini-panel-border,\n.panel .mini-panel-border {\n  border: 1px solid #ccc;\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  border-color: #ccc;\n}\n.globe .mini-grid-cell,\n.panel .mini-grid-cell {\n  vertical-align: middle;\n}\n.globe .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable {\n  overflow: hidden;\n}\n.globe .mini-grid-table.mini-grid-rowstable,\n.globe .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable {\n  overflow: visible;\n}\n.globe .mini-grid-table.mini-grid-rowstable .mini-grid-row > td:last-child,\n.globe .mini-grid-table.mini-grid-rowstable.mini-grid-row > td:last-child,\n.panel .mini-grid-table.mini-grid-rowstable .mini-grid-row > td:last-child,\n.panel .mini-grid-table.mini-grid-rowstable.mini-grid-row > td:last-child {\n  border-right-width: 0;\n}\n.globe .row,\n.panel .row {\n  line-height: 26px;\n  padding: 3px 6px;\n  overflow: hidden;\n  width: 100%;\n  position: relative;\n}\n.globe .row > label,\n.panel .row > label {\n  display: block;\n  text-align: right;\n}\n.globe .row > div > input,\n.panel .row > div > input {\n  height: 26px;\n  width: 100%;\n  display: block;\n  line-height: 26px;\n  padding: 0 0 0 6px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n  float: left;\n  outline: none;\n}\n.globe .row > div > input:focus,\n.panel .row > div > input:focus {\n  border-color: #808891;\n}\n.globe .row > *,\n.panel .row > * {\n  overflow: hidden;\n}\n.globe .row > .col-1,\n.panel .row > .col-1 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-1,\n.panel .row > .row.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-1,\n.panel .row > .mini-datepicker.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-1,\n.panel .row > .mini-datepicker.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-1,\n.panel .row > .mini-buttonedit.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-1,\n.panel .row > .mini-autocomplete.col-1 {\n  padding: 0;\n}\n.globe .row > .col-1,\n.panel .row > .col-1 {\n  width: 8.3333333333%;\n}\n.globe .row > .offset-1,\n.panel .row > .offset-1 {\n  margin-left: 8.3333333333%;\n}\n.globe .row > .col-2,\n.panel .row > .col-2 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-2,\n.panel .row > .row.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-2,\n.panel .row > .mini-datepicker.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-2,\n.panel .row > .mini-datepicker.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-2,\n.panel .row > .mini-buttonedit.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-2,\n.panel .row > .mini-autocomplete.col-2 {\n  padding: 0;\n}\n.globe .row > .col-2,\n.panel .row > .col-2 {\n  width: 16.6666666667%;\n}\n.globe .row > .offset-2,\n.panel .row > .offset-2 {\n  margin-left: 16.6666666667%;\n}\n.globe .row > .col-3,\n.panel .row > .col-3 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-3,\n.panel .row > .row.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-3,\n.panel .row > .mini-datepicker.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-3,\n.panel .row > .mini-datepicker.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-3,\n.panel .row > .mini-buttonedit.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-3,\n.panel .row > .mini-autocomplete.col-3 {\n  padding: 0;\n}\n.globe .row > .col-3,\n.panel .row > .col-3 {\n  width: 25%;\n}\n.globe .row > .offset-3,\n.panel .row > .offset-3 {\n  margin-left: 25%;\n}\n.globe .row > .col-4,\n.panel .row > .col-4 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-4,\n.panel .row > .row.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-4,\n.panel .row > .mini-datepicker.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-4,\n.panel .row > .mini-datepicker.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-4,\n.panel .row > .mini-buttonedit.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-4,\n.panel .row > .mini-autocomplete.col-4 {\n  padding: 0;\n}\n.globe .row > .col-4,\n.panel .row > .col-4 {\n  width: 33.3333333333%;\n}\n.globe .row > .offset-4,\n.panel .row > .offset-4 {\n  margin-left: 33.3333333333%;\n}\n.globe .row > .col-5,\n.panel .row > .col-5 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-5,\n.panel .row > .row.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-5,\n.panel .row > .mini-datepicker.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-5,\n.panel .row > .mini-datepicker.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-5,\n.panel .row > .mini-buttonedit.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-5,\n.panel .row > .mini-autocomplete.col-5 {\n  padding: 0;\n}\n.globe .row > .col-5,\n.panel .row > .col-5 {\n  width: 41.6666666667%;\n}\n.globe .row > .offset-5,\n.panel .row > .offset-5 {\n  margin-left: 41.6666666667%;\n}\n.globe .row > .col-6,\n.panel .row > .col-6 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-6,\n.panel .row > .row.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-6,\n.panel .row > .mini-datepicker.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-6,\n.panel .row > .mini-datepicker.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-6,\n.panel .row > .mini-buttonedit.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-6,\n.panel .row > .mini-autocomplete.col-6 {\n  padding: 0;\n}\n.globe .row > .col-6,\n.panel .row > .col-6 {\n  width: 50%;\n}\n.globe .row > .offset-6,\n.panel .row > .offset-6 {\n  margin-left: 50%;\n}\n.globe .row > .col-7,\n.panel .row > .col-7 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-7,\n.panel .row > .row.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-7,\n.panel .row > .mini-datepicker.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-7,\n.panel .row > .mini-datepicker.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-7,\n.panel .row > .mini-buttonedit.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-7,\n.panel .row > .mini-autocomplete.col-7 {\n  padding: 0;\n}\n.globe .row > .col-7,\n.panel .row > .col-7 {\n  width: 58.3333333333%;\n}\n.globe .row > .offset-7,\n.panel .row > .offset-7 {\n  margin-left: 58.3333333333%;\n}\n.globe .row > .col-8,\n.panel .row > .col-8 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-8,\n.panel .row > .row.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-8,\n.panel .row > .mini-datepicker.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-8,\n.panel .row > .mini-datepicker.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-8,\n.panel .row > .mini-buttonedit.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-8,\n.panel .row > .mini-autocomplete.col-8 {\n  padding: 0;\n}\n.globe .row > .col-8,\n.panel .row > .col-8 {\n  width: 66.6666666667%;\n}\n.globe .row > .offset-8,\n.panel .row > .offset-8 {\n  margin-left: 66.6666666667%;\n}\n.globe .row > .col-9,\n.panel .row > .col-9 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-9,\n.panel .row > .row.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-9,\n.panel .row > .mini-datepicker.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-9,\n.panel .row > .mini-datepicker.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-9,\n.panel .row > .mini-buttonedit.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-9,\n.panel .row > .mini-autocomplete.col-9 {\n  padding: 0;\n}\n.globe .row > .col-9,\n.panel .row > .col-9 {\n  width: 75%;\n}\n.globe .row > .offset-9,\n.panel .row > .offset-9 {\n  margin-left: 75%;\n}\n.globe .row > .col-10,\n.panel .row > .col-10 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-10,\n.panel .row > .row.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-10,\n.panel .row > .mini-datepicker.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-10,\n.panel .row > .mini-datepicker.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-10,\n.panel .row > .mini-buttonedit.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-10,\n.panel .row > .mini-autocomplete.col-10 {\n  padding: 0;\n}\n.globe .row > .col-10,\n.panel .row > .col-10 {\n  width: 83.3333333333%;\n}\n.globe .row > .offset-10,\n.panel .row > .offset-10 {\n  margin-left: 83.3333333333%;\n}\n.globe .row > .col-11,\n.panel .row > .col-11 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-11,\n.panel .row > .row.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-11,\n.panel .row > .mini-datepicker.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-11,\n.panel .row > .mini-datepicker.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-11,\n.panel .row > .mini-buttonedit.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-11,\n.panel .row > .mini-autocomplete.col-11 {\n  padding: 0;\n}\n.globe .row > .col-11,\n.panel .row > .col-11 {\n  width: 91.6666666667%;\n}\n.globe .row > .offset-11,\n.panel .row > .offset-11 {\n  margin-left: 91.6666666667%;\n}\n.globe .row > .col-12,\n.panel .row > .col-12 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-12,\n.panel .row > .row.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-12,\n.panel .row > .mini-datepicker.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-12,\n.panel .row > .mini-datepicker.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-12,\n.panel .row > .mini-buttonedit.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-12,\n.panel .row > .mini-autocomplete.col-12 {\n  padding: 0;\n}\n.globe .row > .col-12,\n.panel .row > .col-12 {\n  width: 100%;\n}\n.globe .row > .offset-12,\n.panel .row > .offset-12 {\n  margin-left: 100%;\n}\n.globe .list_table,\n.panel .list_table {\n  table-layout: fixed;\n  width: 100%;\n  border-top: 1px solid #e0e0e0;\n  border-left: 1px solid #e0e0e0;\n  /* margin-left: -1px; */\n}\n.globe .list_table td,\n.globe .list_table th,\n.panel .list_table td,\n.panel .list_table th {\n  border-right: 1px solid #ededed;\n  border-bottom: 1px solid #ededed;\n  vertical-align: middle;\n}\n.globe .list_table .control_width,\n.panel .list_table .control_width {\n  height: 0;\n}\n.globe .list_table .control_width td,\n.panel .list_table .control_width td {\n  border-width: 0 !important;\n  padding: 0 !important;\n}\n.globe .list_table tr.name td,\n.panel .list_table tr.name td {\n  text-align: left;\n  padding-left: 60px !important;\n  font-size: 16px;\n  font-weight: bold;\n  padding: 8px 0;\n  line-height: 18px;\n}\n.globe .list_table td.list_table-title,\n.globe .list_table th,\n.panel .list_table td.list_table-title,\n.panel .list_table th {\n  background-color: #f6f5fb;\n  text-align: center;\n  padding: 8px 0;\n  line-height: 18px;\n}\n.globe .list_table td.list_table-content,\n.globe .list_table td,\n.panel .list_table td.list_table-content,\n.panel .list_table td {\n  padding: 3px;\n}\n.globe .list_table td.list_table-content > .row,\n.globe .list_table td > .row,\n.panel .list_table td.list_table-content > .row,\n.panel .list_table td > .row {\n  padding: 3px 0;\n}\n.globe .icon-add,\n.panel .icon-add {\n  background: none;\n}\n\n/* body style */\n.body {\n  height: 100%;\n  width: 100%;\n  padding: 8px 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n\n/* btn style*/\n.btn_group {\n  overflow: hidden;\n}\n\n.btn_group.right {\n  float: right;\n}\n\n.btn_group.left {\n  float: left;\n}\n\n.btn_group > a.block_btn,\n.btn_group > a.white_btn {\n  margin: 2px 0 2px 8px;\n  float: left;\n}\n\n.row .btn_group > a.block_btn,\n.row .btn_group > a.white_btn {\n  margin: 0 0 0 8px;\n}\n\na.block_btn,\na.white_btn {\n  vertical-align: top;\n  display: inline-block;\n  height: 26px;\n  background-color: #0b70c1;\n  border: 1px solid #0b70c1;\n  line-height: 24px;\n  font-size: 14px;\n  color: #fff;\n  padding: 0 8px;\n  border-radius: 3px;\n  cursor: pointer;\n  text-align: center;\n  transition: all 0.3 ease-out;\n}\n\na.inline_btn {\n  float: right;\n  color: #3876b9;\n  margin: 0 4px;\n  padding: 0 8px;\n  cursor: pointer;\n  font-size: 16px;\n  position: relative;\n}\n\na.inline_btn:hover {\n  text-decoration: underline;\n}\n\na.white_btn {\n  background-color: #fff;\n  color: #0b70c1;\n}\n\na.block_btn:hover {\n  opacity: 0.9;\n}\n\na.white_btn:hover {\n  background: #efefef;\n}\n\n/* Input */\n.globe input.gb_form,\nselect.gb_form {\n  vertical-align: top;\n  height: 26px;\n  min-width: 100px;\n  display: inline-block;\n  line-height: 24px;\n  padding: 0 0 0 6px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n  outline: none;\n  background-color: #fff;\n}\n\n.globe label.gb_form {\n  vertical-align: top;\n  display: inline-block;\n  padding: 0 3px 0 6px;\n  line-height: 26px;\n  height: 26px;\n}\n\n.globe input.gb_form:focus,\n.globe select.gb_form:focus,\n.globe textarea.gb_form:focus {\n  border-color: #808891;\n}\n\n.globe input.gb_form:disabled,\n.globe select.gb_form:disabled,\n.globe textarea.gb_form:disabled {\n  background-color:  rgb(235, 235, 228);\n}\n\n/* form */\n.legend {\n  height: 26px;\n  position: relative;\n  line-height: 26px;\n  display: block;\n  border-bottom: 2px solid #0b70c1;\n  margin: 4px;\n  padding: 0 6px;\n  color: #0b70c1;\n}\n\nfieldset .row {\n  width: 100%;\n  height: 32px;\n  padding: 3px 6px;\n  line-height: 26px;\n}\n\n/* grid system */\nlabel {\n  white-space: nowrap;\n  word-wrap: normal;\n  word-break: keep-all;\n  padding: 0 6px;\n}\n\n/* textarea */\ntextarea.gb_form {\n  width: 100%;\n  line-height: 18px;\n  padding: 4px 8px;\n  resize: none;\n  height: 100%;\n  min-height: 72px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n}\n\n.globe textarea.gb_form:focus {\n  border-color: #808891;\n}\n\n.required:after {\n  content: \"*\";\n  color: red;\n}");
