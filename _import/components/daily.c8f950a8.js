import{html}from"../../_npm/htl@1.0.0/11521f02.js";import"./fonts.6c240c9a.js";import{dayLabel,fmt,signed}from"./format.6a7f54bb.js";import{trailingAverage}from"./chartData.cd747b9e.js";import{priceChart}from"./priceChart.651ab6d5.js";function dailyRows(table,dataset){return Array.from(table,r=>r.toJSON()).filter(r=>r.dataset===dataset).map(r=>({...r,date:calendarDay(r.date)}))}function calendarDay(value){const d=new Date(value);return new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())}function onOrBefore(points,day){let found=null;for(const p of points){if(p.date<=day)found=p;else break}return found}function change(points,latest,days){const then=new Date(latest.date);then.setDate(then.getDate()-days);const earlier=onOrBefore(points,then);return earlier?(latest.value/earlier.value-1)*100:null}function dailyPanel({rows,series,unit,cite,width,filename,digits=2,average=null}){const bySeries=new Map(series.map(s=>[s.key,rows.filter(r=>r.series===s.key).sort((a,b)=>a.date-b.date)]));const latestDay=new Date(Math.max(...rows.map(r=>r.date)));const table=html`<div class="table-wrap"><table class="quote">
    <thead><tr><th class="text">Series</th><th>Latest</th><th class="text">Date</th><th>1 week</th><th>4 weeks</th><th>52 weeks</th></tr></thead>
    <tbody>${series.map(s=>{const points=bySeries.get(s.key);if(!points?.length)return html`<tr><td class="text">${s.label}</td><td colspan="5">No observations</td></tr>`;const latest=points[points.length-1];return html`<tr>
        <td class="text">${s.label}</td>
        <td class="level">${fmt(latest.value,digits)}</td>
        <td class="text">${dayLabel(latest.date)}</td>
        <td>${signed(change(points,latest,7))}</td>
        <td>${signed(change(points,latest,28))}</td>
        <td>${signed(change(points,latest,364))}</td>
      </tr>`})}</tbody>
  </table></div>`;const daily=rows.filter(r=>bySeries.has(r.series)).map(r=>({key:r.series,date:r.date,value:r.value}));const chartUnit=average?`${unit}, ${average}-day average`:unit;return html`<div>
    ${table}
    <p class="table-note">${unit}. Changes are against each series' observation on or before the
      same day 1, 4 and 52 weeks earlier.</p>
    ${priceChart({series:series.map(s=>({key:s.key,label:s.short??s.label})),data:average?trailingAverage(daily,average):daily,unit:chartUnit,width,daily:true,defaultWindow:"2 years",digits:average?1:digits,filename:`${filename}_${latestDay.toISOString().slice(0,10)}.png`,sourceLine:`Source: ${cite}. ${average?chartUnit:`${unit}, daily`}, to ${dayLabel(latestDay)}.`})}
  </div>`}export{dailyPanel,dailyRows};
