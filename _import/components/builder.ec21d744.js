import{html}from"../../_npm/htl@1.0.0/11521f02.js";import"./fonts.6c240c9a.js";import{catalogOf,gapRows,MAX_GROUPS,MAX_NOTES,MAX_SERIES,MAX_TEXT,parseState,seriesLabel,serializeState,sourceLine}from"./builderState.0064c1c8.js";import{pageMeta,rowsOf}from"./commodity.53223391.js";import{digitsFor,legendLabel,monthDate,monthLabel,shiftMonth,unitLabel}from"./format.6a7f54bb.js";import{gapChart}from"./gapChart.2d4d437c.js";import{priceChart}from"./priceChart.651ab6d5.js";import{PAGES}from"./sources.8a8f940e.js";const DEFAULT_YEARS=5;const EXAMPLES=[{label:"Grain prices and the costs of moving and growing grain, against their five-year average",query:"type=gap&group=Grain prices|F-RICE-THAI5,F-MAIZE-WB,F-WHEAT-HRW&group=Costs of moving and growing grain|F-SHIPPING-GOFI,F-FERT-DAP,F-CRUDE-BRENT&name=F-RICE-THAI5|Rice&name=F-MAIZE-WB|Maize&name=F-WHEAT-HRW|Wheat&name=F-SHIPPING-GOFI|Grain freight&name=F-FERT-DAP|Fertilizer (DAP)&name=F-CRUDE-BRENT|Crude oil (Brent)"},{label:"Phosphate and nitrogen fertilizer prices since April 2022",query:"type=line&group=|F-FERT-DAP,F-FERT-UREA&from=2022-04&name=F-FERT-DAP|Phosphate (DAP)&name=F-FERT-UREA|Nitrogen (urea)"}];function pageTitle(section){if(section==="FPI")return"FAO Food Price Index";return PAGES.find(p=>p.sections?.includes(section))?.title??section}function seriesPicker(entries,onPick){const byPage=new Map;for(const e of entries){const title=pageTitle(e.section);if(!byPage.has(title))byPage.set(title,[]);byPage.get(title).push(e)}return html`<select onchange=${event=>event.target.value&&onPick(event.target.value)}>
    <option value="">Add a series…</option>
    ${[...byPage].map(([title,list])=>html`<optgroup label=${title}>
      ${list.map(e=>html`<option value=${e.fid}>${legendLabel(e)}</option>`)}
    </optgroup>`)}
  </select>`}function textInput(value,placeholder,onChange){return html`<input type="text" maxlength=${MAX_TEXT} value=${value??""} placeholder=${placeholder}
    onchange=${event=>onChange(event.target.value)}>`}function monthInput(value,{min,max},onChange){return html`<input type="month" value=${value??""} min=${min} max=${max} placeholder="YYYY-MM"
    onchange=${event=>onChange(event.target.value)}>`}function move(list,i,by){const j=i+by;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]]}function builder({prices,history,fpi,meta,width}){if(meta.status!=="built")return pageMeta(meta);const catalog=catalogOf(rowsOf(prices),rowsOf(history),rowsOf(fpi));const historyRows=rowsOf(history);let{state,problems}=parseState(new URLSearchParams(location.search),catalog);if(!state.groups.length)state.groups=[{name:"",fids:[]}];const root=html`<div class="builder"></div>`;const reach=shiftMonth(catalog.last,24);function update(edit){edit(state);({state,problems}=parseState(new URLSearchParams(serializeState(state)),catalog));window.history.replaceState(null,"",`?${serializeState(state)}`);if(!state.groups.length)state.groups=[{name:"",fids:[]}];render()}function chosen(){return state.groups.flatMap(g=>g.fids)}function addable(){const taken=new Set(chosen());const first=catalog.series.get(chosen()[0]);return[...catalog.series.values()].filter(e=>{if(taken.has(e.fid)||!e.months.size)return false;if(state.type==="gap")return e.vs_five!=null;return!first||e.unit===first.unit})}function groupBlock(group,gi){const full=chosen().length>=MAX_SERIES[state.type];return html`<fieldset class="builder-group">
      ${state.type==="gap"?html`<label>Group heading ${textInput(group.name,"e.g. Grain prices",v=>update(s=>{s.groups[gi].name=v}))}</label>`:""}
      <ol>
        ${group.fids.map((fid,i)=>html`<li>
          <span class="series-name">${catalog.series.get(fid).name}</span>
          ${textInput(state.names[fid],`Name on chart: ${catalog.series.get(fid).label}`,v=>update(s=>{s.names[fid]=v}))}
          <button title="Move up" onclick=${()=>update(s=>move(s.groups[gi].fids,i,-1))}>↑</button>
          <button title="Move down" onclick=${()=>update(s=>move(s.groups[gi].fids,i,1))}>↓</button>
          <button title="Remove" onclick=${()=>update(s=>{s.groups[gi].fids.splice(i,1);delete s.names[fid];s.labels=s.labels.filter(l=>l.fid!==fid)})}>×</button>
        </li>`)}
      </ol>
      ${full?html`<p class="hint">This chart takes ${MAX_SERIES[state.type]} series at most.</p>`:seriesPicker(addable(),fid=>update(s=>{s.groups[gi].fids.push(fid)}))}
      ${state.type==="gap"&&state.groups.length>1?html`<button onclick=${()=>update(s=>{s.groups.splice(gi,1)})}>Remove this group</button>`:""}
    </fieldset>`}function lineControls(){const fids=chosen();const to=state.to??catalog.last;const from=state.from??[shiftMonth(to,-12*DEFAULT_YEARS),catalog.first].sort().at(-1);const bounds={min:catalog.first,max:catalog.last};const spanBounds={min:catalog.first,max:reach};return html`<div>
      <h3>Months</h3>
      <p>From ${monthInput(from,bounds,v=>update(s=>{s.from=v}))}
        to ${monthInput(to,bounds,v=>update(s=>{s.to=v}))}</p>
      <h3>Labels</h3>
      <p class="hint">A label marks one month of one line, for example "September: 117 USD a barrel".</p>
      ${state.labels.map((l,i)=>html`<p class="builder-row">
        <select onchange=${event=>update(s=>{s.labels[i].fid=event.target.value})}>
          ${fids.map(fid=>html`<option value=${fid} selected=${fid===l.fid}>${seriesLabel(state,catalog,fid)}</option>`)}
        </select>
        ${monthInput(l.month,bounds,v=>update(s=>{s.labels[i].month=v}))}
        ${textInput(l.text,"Label",v=>update(s=>{s.labels[i].text=v}))}
        <button title="Remove" onclick=${()=>update(s=>{s.labels.splice(i,1)})}>×</button>
      </p>`)}
      ${fids.length&&state.labels.length<MAX_NOTES?html`<button onclick=${()=>update(s=>{s.labels.push({fid:fids[0],month:to,text:"Label"})})}>Add a label</button>`:""}
      <h3>Shaded spans</h3>
      <p class="hint">A span shades a run of months, up to ${monthLabel(reach)}, and names it over the chart.</p>
      ${state.spans.map((sp,i)=>html`<p class="builder-row">
        ${monthInput(sp.from,spanBounds,v=>update(s=>{s.spans[i].from=v}))}
        to ${monthInput(sp.to,spanBounds,v=>update(s=>{s.spans[i].to=v}))}
        ${textInput(sp.text,"Name of the span",v=>update(s=>{s.spans[i].text=v}))}
        <button title="Remove" onclick=${()=>update(s=>{s.spans.splice(i,1)})}>×</button>
      </p>`)}
      ${fids.length&&state.spans.length<MAX_NOTES?html`<button onclick=${()=>update(s=>{s.spans.push({from:shiftMonth(to,-2),to,text:"Span"})})}>Add a span</button>`:""}
    </div>`}function chart(){const fids=chosen();if(!fids.length)return html`<p class="hint">Add a series to draw a chart.</p>`;const filename=`chart_${meta.data_month}.png`;const source=sourceLine(state,catalog,meta.data_month);if(state.type==="gap")return gapChart({rows:gapRows(state,catalog),sourceLine:source,filename,width});const unit=catalog.series.get(fids[0]).unit;const to=state.to??catalog.last;const from=state.from??[shiftMonth(to,-12*DEFAULT_YEARS),catalog.first].sort().at(-1);return priceChart({series:fids.map(fid=>({key:fid,label:seriesLabel(state,catalog,fid)})),data:historyRows.filter(h=>fids.includes(h.fid)).map(h=>({key:h.fid,date:monthDate(h.period),value:h.value})),unit:unitLabel(unit),digits:digitsFor(unit),width,filename,sourceLine:source,breaks:fids.map(fid=>catalog.series.get(fid)).filter(e=>e.basis_from).map(e=>({date:monthDate(e.basis_from),label:`${seriesLabel(state,catalog,e.fid)}: basis changed`})),range:{from:monthDate(from),to:monthDate(to)},spans:state.spans.map(s=>({from:monthDate(s.from),to:monthDate(shiftMonth(s.to,1)),text:s.text})),marks:state.labels.map(l=>({key:l.fid,date:monthDate(l.month),text:l.text}))})}function render(){const copy=html`<button onclick=${async event=>{try{await navigator.clipboard.writeText(location.href);event.target.textContent="Link copied"}catch{event.target.textContent="Copy the address bar instead"}}}>Copy link to this chart</button>`;root.replaceChildren(html`<div>
      <p class="builder-examples">Start from:
        ${EXAMPLES.map(e=>html`<a href=${`?${e.query}`}>${e.label}</a>`)}</p>
      <p class="builder-type">
        <label><input type="radio" name="type" checked=${state.type==="line"}
          onchange=${()=>update(s=>{s.type="line"})}> Prices over time</label>
        <label><input type="radio" name="type" checked=${state.type==="gap"}
          onchange=${()=>update(s=>{s.type="gap"})}> Against the five-year average</label>
      </p>
      ${state.groups.map(groupBlock)}
      ${state.type==="gap"&&state.groups.length<MAX_GROUPS&&chosen().length?html`<button onclick=${()=>update(s=>{s.groups.push({name:"",fids:[]})})}>Add a group</button>`:""}
      ${state.type==="line"?lineControls():""}
      ${problems.length?html`<div class="banner"><strong>Left off this chart:</strong>
        <ul>${problems.map(p=>html`<li>${p}</li>`)}</ul></div>`:""}
      ${chart()}
      ${chosen().length?copy:""}
    </div>`)}render();return root}export{EXAMPLES,builder};
