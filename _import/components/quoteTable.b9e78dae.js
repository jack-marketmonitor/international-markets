import{html}from"../../_npm/htl@1.0.0/11521f02.js";import{dayLabel,digitsFor,fmt,shiftMonth,shortMonth,signed,unitLabel}from"./format.6a7f54bb.js";import{latestFor}from"./latest.011583db.js";function seriesCell(row){const unit=unitLabel(row.unit);return html`<td class="text">${row.name}${unit?html` <span style="color:#585858">(${unit})</span>`:""}${row.note?html`<br><small style="color:#a95b24">${row.note}</small>`:""}</td>`}function latestCell(row,latest,digits){const quote=latestFor(row,latest);if(!quote)return html`<td class="text">–</td>`;const other=quote.publisher!==row.cite_as;return html`<td class="text" title=${`${quote.publisher}, ${quote.quote}, ${dayLabel(quote.date)}`}>${fmt(quote.value,digits)}<br><small style="color:#585858">${dayLabel(quote.date)}${other?`, ${quote.publisher}`:""}</small></td>`}function quoteTable(rows,{caption,latest}={}){if(!rows.length)return html`<p class="table-note">No figures in this build.</p>`;const month=rows[0].data_month;const year=Number(month.slice(0,4));const mon=shortMonth(month).slice(0,3);const anyNA=rows.some(r=>[r.level,r.prior,r.year_ago,r.five_avg,r.cv12].some(v=>v==null));const showLatest=Boolean(latest)&&rows.some(r=>latest.has(r.fid));return html`<div>
    ${caption?html`<p class="table-caption">${caption}</p>`:""}
    <div class="table-wrap"><table class="quote">
      <thead><tr>
        <th class="text">Series</th><th>${shortMonth(month)}</th><th>${shortMonth(shiftMonth(month,-1))}</th>
        <th>MoM</th><th>${shortMonth(shiftMonth(month,-12))}</th><th>YoY</th>
        <th>${mon} avg ${year-5}–${String(year-1).slice(2)}</th><th>vs avg</th><th>12m CV</th>
        <th class="text">Released</th>${showLatest?html`<th class="text">Latest price</th>`:""}
      </tr></thead>
      <tbody>${rows.map(r=>{const d=digitsFor(r.unit);return html`<tr>
          ${seriesCell(r)}
          <td class="level">${fmt(r.level,d)}</td>
          <td>${fmt(r.prior,d)}</td>
          <td>${signed(r.mom)}</td>
          <td>${fmt(r.year_ago,d)}</td>
          <td>${signed(r.yoy)}</td>
          <td>${fmt(r.five_avg,d)}</td>
          <td>${signed(r.vs_five)}</td>
          <td>${r.cv12==null?"n/a":`${fmt(r.cv12)}%`}</td>
          <td class="text">${r.released?dayLabel(r.released):"n/a"}</td>${showLatest?latestCell(r,latest,d):""}
        </tr>`})}</tbody>
    </table></div>
    ${anyNA?html`<p class="table-note">n/a: not available.</p>`:""}
    ${showLatest?html`<p class="table-note">Latest price: the newest dated quote of each row's
      benchmark, shown when it is newer than the ${shortMonth(month)} average; a publisher named
      under it is not the row's own. Hover for the quotation. A dash: nothing newer yet.</p>`:""}
  </div>`}export{quoteTable};
