
var kyData = {"GEOCODE":21,"NAME":"Kentucky","multi_race":244840,"hisp_latino":207854,"white_alone_nh":3664764,"black_alone_nh":357764,"asian_alone_nh":73843,"other_races":14706}
import * as d3 from 'd3'
let pymChild
mapboxgl.accessToken = 'ACESS KEY';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/suhail-bhat/ckshyymd800cn17pnley1fnpk',
    center: [-85.0, 37.9 ],
    zoom: 8.5,// starting zoom
    minZoom: 8,
    trackResize: true,
    dragRotate: false,
    touchZoomRotate: true
});
map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
  })
  );
  map.addControl(
    new mapboxgl.NavigationControl({ showCompass: false }),
    'bottom-right'
  )
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right')

  // --------------------------------------------------------------------------------

d3.csv(require('/data/pop_by_CT2020.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))  
function ready (datapoints){
  map.on('load', function() {
    map.addSource('censusTracts', {
        type: 'vector',
        url: 'mapbox://suhail-bhat.cd480ajr',
        promoteId: 'GEOID20'
      })
      datapoints.forEach(d =>{

        map.setFeatureState(
            {
              source: 'censusTracts',
              sourceLayer: "ky_tract_baseLayer-6ds9vl",
              id: +d.GEOCODE
            },
            {
                pct_white: +d.pct_white,
                pct_black: +d.pct_black,
                pct_hisp: +d.pct_hisp_lat,
                pct_asian:+d.pct_asian,
                pct_multi_race:+d.pct_multi_race,
                pct_other_races: +d.pct_other_races,
                GEOCODE: d.GEOCODE,
                TractName: d.NAME,
                total_pop: +d.total_pop,
                hisp_latino: +d.hisp_latino,
                white_alone_nh: +d.white_alone_nh,
                black_alone_nh: +d.black_alone_nh,
                asian_alone_nh: +d.asian_alone_nh,
                other_races: +d.other_races,
                multi_race: +d.multi_race

            }     
            )
      })
    // ---------------------------------------------------------------------------//
            // Add layers here
    // ---------------------------------------------------------------------------//
    function addLayer(layerId, visibility, propertyName){
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: 'censusTracts',
            'source-layer': "ky_tract_baseLayer-6ds9vl",
        layout: { visibility: visibility },
        paint: {
          'fill-color': [
            'case',
            ['!=', ['feature-state', propertyName], null],
            [
              'interpolate',
              ['linear'],
              ['to-number', ['feature-state', propertyName]],
              0,
              '#D3D3D3',
              10,
              '#f2df91',
              20,
              '#f9c467',
              30,
              '#ffa93e',
              40,
              '#ff8b25',
              50,
              '#fd6a0b',
              60,
              '#f04f08',
              70,
              '#d8382e',
              80,
              '#c62832',
              90,
              '#af1c43',
              100,
              '#8a1739'
            ],
            '#D3D3D3'
          ]
        }
      })
    }
    addLayer('whiteLayer', 'visible', 'pct_white')
    addLayer('blackLayer', 'none', 'pct_black')
    addLayer('hispanicLayer', 'none', 'pct_hisp')
    addLayer('asianLayer', 'none', 'pct_asian')
    addLayer('multiRaceLayer', 'none', 'pct_multi_race')
    addLayer('otherRaceLayer', 'none', 'pct_other_races')
    // ---------------------------------------------------------------------------//
            // Moving layers down
    // ---------------------------------------------------------------------------//
    const layers = map.getStyle().layers;
    map.moveLayer(layers[76].id, layers[4].id);
    map.moveLayer(layers[77].id, layers[4].id);
    map.moveLayer(layers[78].id, layers[4].id);
    map.moveLayer(layers[79].id, layers[4].id);
    map.moveLayer(layers[80].id, layers[4].id);
    map.moveLayer(layers[81].id, layers[4].id);
    // ------------------------------------------------------------------------------\
          // create charts here
    // ------------------------------------------------------------------------------\
    const dataFiltered=datapoints[0]
    const margin = { top: 10, left: 100, right: 65, bottom: 10 }
    const height = 200 - margin.top - margin.bottom
    const width = 640 - margin.left - margin.right

    const svg = d3
      .select('#clickFeatures')
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const xScale = d3.scaleLinear().range([0, width])
    const yScale = d3.scaleBand().range([height, 0])
    function drawChart(dataSource) {

      // const filteredData
      var filteredData={}
      filteredData["Other Races"]= +dataSource.other_races
      filteredData['Asian']= +dataSource.asian_alone_nh,
      filteredData['Hispanic']= +dataSource.hisp_latino,
      filteredData['Multiracial']= +dataSource.multi_race,
      filteredData['Black']= +dataSource.black_alone_nh,
      filteredData['White']= +dataSource.white_alone_nh

      const columnNames = d3.keys(filteredData)
      const columnValues = d3.values(filteredData)
      const newData= d3.transpose([columnNames, columnValues])

      yScale.domain(d3.keys(filteredData))
      xScale.domain([0, d3.max(columnValues)])  
      const commaFormat = d3.format(',')

      svg
        .selectAll('.raceRect')
        .data(newData)
        .join('rect')
        .attr('class', 'raceRect')
        .attr('fill', '#8856a7')

      svg
        .selectAll('.rightLabel')
        .data(newData)
        .join('text')
        .attr('class', 'rightLabel')
        .text(d=> commaFormat(+d[1]))

      svg
        .selectAll('.leftLabel')
        .data(columnNames)
        .join('text')
        .attr('class', 'leftLabel')
        .text(d=>d)
        .attr("text-anchor", "end")

        
      function render() {
        // console.log('Rendering')
        const svgContainer = svg.node().closest('div')
        const svgWidth = svgContainer.offsetWidth
        // Do you want it to be full height? Pick one of the two below
        const svgHeight = height + margin.top + margin.bottom
        // const svgHeight = window.innerHeight

        const actualSvg = d3.select(svg.node().closest('svg'))
        actualSvg.attr('width', svgWidth).attr('height', svgHeight)

        const newWidth = svgWidth - margin.left - margin.right
        const newHeight = svgHeight - margin.top - margin.bottom

        // Update our scale
        xScale.range([0, newWidth])
        yScale.range([newHeight, 0])

        svg
          .selectAll('.raceRect')
          .attr('y', d=>yScale(d[0]))
          .attr('height', yScale.bandwidth() - 2)
          .attr('x', 0)
          .attr('width', d=> xScale(+d[1]))

        svg
          .selectAll('.rightLabel')
          .attr('y', function(d){return yScale(d[0]) +(yScale.bandwidth()/2 )+2})
          .attr('x', d=> xScale(d[1])+3)

        svg
          .selectAll('.leftLabel')
          .attr('y', function(d){return yScale(d)+(yScale.bandwidth()/2)+2})
          .attr('x', -5)
      
      }
      render()
      window.addEventListener('resize', render)
    }
    drawChart(kyData)     
    // -------------------------------------------------------
        // Add a black outline around the polygon.
    // -------------------------------------------------------
    map.addLayer({
      'id': 'tracts-highlighted',
      'type': 'line',
      source: 'censusTracts',
        'source-layer': "ky_tract_baseLayer-6ds9vl",
      'layout': {},
      'paint': {
      'line-color': 'black',
      'line-width': 2
      },
      'filter': ['in', 'GEOID20', '']
      }
    );    
    // ------------------------------------------------------------------------------\
            // tooltip starts here
    // ------------------------------------------------------------------------------\
    function selectedLayer(layerName){
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false
      })
      map.on('click', layerName, function(e) {
          map.flyTo({
            center: e.features[0].geometry.coordinates[0][0],
            speed: 10, 
            // zoom:10, 
            bearing: 0,
            curve: 1, 
            easing: (t) => t,
            essential: true
          })

          map.getCanvas().style.cursor = 'pointer'
          const censusTract = map.queryRenderedFeatures(e.point, {
            layers: [layerName]
          })
          const tractProp = censusTract[0].state
          const layerProp = censusTract[0].properties

          document.getElementById('pd').innerHTML = tractProp.TractName
          drawChart(tractProp) 

          const bbox = [
            [e.point.x - 1, e.point.y - 1],
            [e.point.x + 1, e.point.y + 1]
            ];
          // Find features intersecting the bounding box.
          const selectedFeatures = map.queryRenderedFeatures(bbox, {
            layers: [layerName]
            });
            const uniqueId = selectedFeatures.map(
              (feature) => feature.properties.GEOID20
              );

              map.setFilter('tracts-highlighted', ['in', 'GEOID20', ...uniqueId])              
        })
    }
    selectedLayer('whiteLayer')
    // ------------------------------------------------------------------------------\
            // click events starts here
    // ------------------------------------------------------------------------------\
    document.getElementById('white').onclick = function(d){
      map.setLayoutProperty('whiteLayer', 'visibility', 'visible')
      map.setLayoutProperty('blackLayer', 'visibility', 'none')
      map.setLayoutProperty('hispanicLayer', 'visibility', 'none')
      map.setLayoutProperty('asianLayer', 'visibility', 'none')
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'none')
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'none')
      selectedLayer('whiteLayer')
    }

    document.getElementById('black').onclick = function(d){
      map.setLayoutProperty('blackLayer', 'visibility', 'visible')
      map.setLayoutProperty('whiteLayer', 'visibility', 'none')
      map.setLayoutProperty('hispanicLayer', 'visibility', 'none')
      map.setLayoutProperty('asianLayer', 'visibility', 'none')
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'none')
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'none')
      selectedLayer('blackLayer')

    }

    document.getElementById('hispanic').onclick = function(d){
      map.setLayoutProperty('hispanicLayer', 'visibility', 'visible')
      map.setLayoutProperty('blackLayer', 'visibility', 'none')
      map.setLayoutProperty('whiteLayer', 'visibility', 'none')
      map.setLayoutProperty('asianLayer', 'visibility', 'none')
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'none')
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'none')
      selectedLayer('hispanicLayer')

    }

    document.getElementById('asian').onclick = function(d){
      map.setLayoutProperty('asianLayer', 'visibility', 'visible')
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'none')
      map.setLayoutProperty('blackLayer', 'visibility', 'none')
      map.setLayoutProperty('whiteLayer', 'visibility', 'none')
      map.setLayoutProperty('hispanicLayer', 'visibility', 'none')
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'none')
      selectedLayer('asianLayer')

    }

    document.getElementById('multirace').onclick = function(d){
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'visible')
      map.setLayoutProperty('blackLayer', 'visibility', 'none')
      map.setLayoutProperty('whiteLayer', 'visibility', 'none')
      map.setLayoutProperty('hispanicLayer', 'visibility', 'none')
      map.setLayoutProperty('asianLayer', 'visibility', 'none')
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'none')
      selectedLayer('multiRaceLayer')

    }

    document.getElementById('otherraces').onclick = function(d){
      map.setLayoutProperty('otherRaceLayer', 'visibility', 'visible')
      map.setLayoutProperty('multiRaceLayer', 'visibility', 'none')
      map.setLayoutProperty('blackLayer', 'visibility', 'none')
      map.setLayoutProperty('whiteLayer', 'visibility', 'none')
      map.setLayoutProperty('hispanicLayer', 'visibility', 'none')
      map.setLayoutProperty('asianLayer', 'visibility', 'none')
      selectedLayer('otherRaceLayer')

    }
    
  })
  const pymChild = new pym.Child({ polling: 100 });

}

