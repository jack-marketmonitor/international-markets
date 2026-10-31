import{html}from"../../_npm/htl@1.0.0/11521f02.js";import"./fonts.6c240c9a.js";import{dayLabel,legendLabel,monthDate,monthLabel}from"./format.6a7f54bb.js";import{priceChart}from"./priceChart.651ab6d5.js";import{latestByFid}from"./latest.011583db.js";import{quoteTable}from"./quoteTable.b9e78dae.js";function rowsOf(table){return table?Array.from(table,r=>r.toJSON()):[]}function pageMeta(meta){if(meta.status!=="built"){return html`<div class="banner">Monthly figures are not available yet.</div>`}return html`<div>
    <p class="page-meta"><strong>${monthLabel(meta.data_month)}</strong> monthly averages ·
      updated ${dayLabel(meta.built_at.slice(0,10))}</p>
  </div>`}function sourceLine(rows,unit,dataMonth){const cites=[...new Set(rows.map(r=>r.cite_as).filter(Boolean))];return`Source: ${cites.join(", ")}. ${unit}, monthly averages to ${monthLabel(dataMonth)}.`}function commodityPage({sections,tables,charts=[],prices,history,meta,latest,width}){const all=rowsOf(prices).filter(r=>sections.includes(r.section));const quotes=latestByFid(latest);if(meta.status!=="built")return pageMeta(meta);const main=all.filter(r=>r.table!=="eia");const eia=all.filter(r=>r.table==="eia");const hist=rowsOf(history);const chartBlocks=charts.map(c=>{const chartRows=c.fids.map(fid=>all.find(r=>r.fid===fid)).filter(Boolean);const data=hist.filter(h=>c.fids.includes(h.fid)).map(h=>({key:h.fid,date:monthDate(h.period),value:h.value}));const breaks=chartRows.filter(r=>r.basis_from).map(r=>({date:monthDate(r.basis_from),label:`${legendLabel(r)}: basis changed`}));return html`<div>
      ${c.title?html`<h3>${c.title}</h3>`:""}
      ${priceChart({series:chartRows.map(r=>({key:r.fid,label:legendLabel(r)})),data,unit:c.unit,breaks,width,filename:`${c.filename}_${meta.data_month}.png`,sourceLine:sourceLine(chartRows,c.unit,meta.data_month)})}
    </div>`});return html`<div>
    ${pageMeta(meta)}
    ${tables?tables.map(t=>quoteTable(main.filter(r=>t.sections.includes(r.section)),{caption:t.caption,latest:quotes})):quoteTable(main,{latest:quotes})}
    ${eia.length?quoteTable(eia,{caption:"EIA spot prices, monthly averages",latest:quotes}):""}
    ${chartBlocks}
  </div>`}export{commodityPage,pageMeta,rowsOf};
