async function render_viz_graph(params, userSettings) {
  const { source, engine = 'dot', canvasHeight = 500 } = params;
  const { enableMouseZoomPan = 'true' } = userSettings || {};
  const buttonHeight = 30;
  const htmlString = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Viz.js Graph</title><script src="https://cdn.jsdelivr.net/npm/@viz-js/viz@3.11.0/lib/viz-standalone.min.js"></script><style>.graph-wrapper{position:relative;height:${canvasHeight + buttonHeight}px;overflow:auto;}#graph-container{padding-top:${buttonHeight + 10}px;display:flex;justify-content:center;align-items:center;}#graph-container svg{display:block;}.controls-container{position:absolute;top:5px;left:5px;display:flex;align-items:center;gap:5px;}.control-button{background-color:transparent;border:none;padding:5px;cursor:pointer;border-radius:4px;display:flex;align-items:center;}.control-button:hover{background-color:rgba(200,200,200,0.2);}.dropdown-container{display:inline-block;}.dropdown-button{background-color:transparent;border:none;padding:5px;cursor:pointer;border-radius:4px;display:flex;align-items:center;}.dropdown-button:hover{background-color:rgba(200,200,200,0.2);}.dropdown-button::after{content:"\\25BC";margin-left:0px;font-size:.8em;color:#888;}.dropdown-menu{display:none;position:absolute;background-color:#fff;border:1px solid #eee;border-radius:4px;padding:5px 0;min-width:120px;z-index:1;white-space:nowrap;box-shadow:0 2px 5px rgba(0,0,0,.1);}.dropdown-container:hover .dropdown-menu{display:block;}.dropdown-menu a{display:block;padding:8px 15px;text-decoration:none;color:#333;}.dropdown-menu a:hover{background-color:#f0f0f0;}</style></head><body><div class="graph-wrapper"><div id="graph-container"></div><div class="controls-container"><div class="dropdown-container"><div class="dropdown-button"></div><div class="dropdown-menu"><a href="#" id="download-svg-link">Save as SVG</a></div></div><button class="control-button" id="zoom-in">+</button><button class="control-button" id="zoom-out">-</button><button class="control-button" id="reset-zoom">Reset</button></div></div><script>async function renderGraph(){try{const viz=await Viz.instance();const graphContainer=document.getElementById('graph-container');const svgElement=viz.renderSVGElement(\`${source}\`,{engine:'${engine}'});graphContainer.appendChild(svgElement);const svg=graphContainer.querySelector('svg');const originalSvgWidth=parseFloat(svg.getAttribute('width'));const originalSvgHeight=parseFloat(svg.getAttribute('height'));let scale=1;let translateX=0;let translateY=0;let isDragging=false;let startX=0;let startY=0;const enableMouseZoomPan='${enableMouseZoomPan}'==='true';function updateTransform(){svg.setAttribute('transform',\`translate(\${translateX},\${translateY}) scale(\${scale})\`);}function fitToScreen(){const containerRect=graphContainer.getBoundingClientRect();const style=window.getComputedStyle(graphContainer);const paddingTop=parseFloat(style.paddingTop);const paddingBottom=parseFloat(style.paddingBottom);const availableWidth=containerRect.width;const availableHeight=containerRect.height-paddingTop-paddingBottom;const scaleX=availableWidth/originalSvgWidth;const scaleY=availableHeight/originalSvgHeight;scale=Math.min(scaleX,scaleY,1);translateX=(availableWidth-originalSvgWidth*scale)/2;translateY=(availableHeight-originalSvgHeight*scale)/2+paddingTop;updateTransform();}fitToScreen();const zoomInButton=document.getElementById('zoom-in');const zoomOutButton=document.getElementById('zoom-out');const resetZoomButton=document.getElementById('reset-zoom');zoomInButton.addEventListener('click',()=>{scale*=1.2;updateTransform();});zoomOutButton.addEventListener('click',()=>{scale/=1.2;updateTransform();});resetZoomButton.addEventListener('click',()=>{svg.removeAttribute('transform');requestAnimationFrame(fitToScreen);});let resizeObserver;if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(()=>{fitToScreen();});resizeObserver.observe(graphContainer);}if(enableMouseZoomPan){svg.addEventListener('mousedown',(e)=>{isDragging=true;startX=e.clientX-translateX;startY=e.clientY-translateY;});document.addEventListener('mousemove',(e)=>{if(!isDragging)return;translateX=e.clientX-startX;translateY=e.clientY-startY;updateTransform();});document.addEventListener('mouseup',()=>{isDragging=false;});svg.addEventListener('wheel',(e)=>{e.preventDefault();const zoomFactor=e.deltaY>0?.9:1.1;scale*=zoomFactor;updateTransform();});}const dropdownContainer=document.querySelector('.dropdown-container');const dropdownMenu=document.querySelector('.dropdown-menu');function adjustDropdownPosition(){const containerRect=dropdownContainer.getBoundingClientRect();const menuRect=dropdownMenu.getBoundingClientRect();const viewportWidth=window.innerWidth;if(menuRect.right>viewportWidth){dropdownMenu.style.right='auto';dropdownMenu.style.left='auto';dropdownMenu.style.transform='translateX(0)';}else{dropdownMenu.style.right='auto';dropdownMenu.style.left='5px';dropdownMenu.style.transform='none';}}dropdownContainer.addEventListener('mouseover',adjustDropdownPosition);const downloadLink=document.getElementById('download-svg-link');downloadLink.addEventListener('click',downloadSVG);function downloadSVG(event){event.preventDefault();const svgString=graphContainer.innerHTML;const blob=new Blob([svgString],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='graph.svg';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}}catch(error){console.error("Error rendering graph:",error);document.getElementById('graph-container').innerHTML="<p>Error rendering graph: "+error.message+". Please check your input data and graph syntax.</p>";}}renderGraph();</script></body></html>`;
  return htmlString;
}
