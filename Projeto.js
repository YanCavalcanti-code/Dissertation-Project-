var map = L.map('map', { center: [41.1613971,-8.6257584], zoom: 13, zoomControl: false});

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Watermark - CANVAS

L.Control.Watermark = L.Control.extend({
  onAdd: function(map) {
      var img = L.DomUtil.create('img');

      img.src = './Image/CANVASLogo.png';
      img.style.width = '150px';

      return img;
  },

  onRemove: function(map) {
      // Nothing to do here
  }
});

L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
}

L.control.watermark({ position: 'topleft'}).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Mini-Map

var osmUrl='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var osmAttrib='Map data &copy; OpenStreetMap contributors';		
//Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib });
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Coordinate Mouse (1)
var coordDIV = document.createElement('div');
coordDIV.id = 'mapCoordDIV';
coordDIV.style.position = 'absolute';
coordDIV.style.bottom = '1px';
coordDIV.style.left = '150px';
coordDIV.style.zIndex = '900';
coordDIV.style.color = '#404040';
coordDIV.style.fontFamily = 'Arial';
coordDIV.style.fontSize = '10pt';
coordDIV.style.backgroundColor = '#FFFFFF';
coordDIV.style.opacity='0.7';

document.getElementById('map').appendChild(coordDIV);

//Coordinate Mouse (2)
map.on('mousemove', function(e){
    var lat = e.latlng.lat.toFixed(10);
    var lon = e.latlng.lng.toFixed(10);
    document.getElementById('mapCoordDIV').innerHTML = 'Coordinates: ' + lat + ' , ' + lon;
});


//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Mapcode
L.control.mapcodes({
  position: "bottomright",  // optional default "bottomright"
  labelTemplate: "Mapcode: {0}", // optional default "{0}"
}).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Import Base Map

var Imaginary= L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{ attribution:'© <a href="https://www.esri.com/en-us/home">ESRI</a> World Imaginary' }
);
var CartoDB_PositronOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
	attribution: '<br>&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var Imaginary_street= L.layerGroup ([Imaginary, CartoDB_PositronOnlyLabels]).addTo(map);

//////////////////

var OpenStreetMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution:'<a href="https://www.openstreetmap.org/#map=17/-21.00148/-44.99806">©OpenStreetMap</a> Contributors'});

/////////////////

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,<br> <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

////////////////

var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/yansc/cknvzchqa21rw17nxl2jg80ae/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieWFuc2MiLCJhIjoiY2tudnprZ2ZiMHJzaTJxcnZ2ZTFpNTR6YiJ9.ISvDn6VrdLEli_j3ihlIvA', {attribution:'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'});

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Add Geojson

// Porto Concelho

var porto_freguesias = new L.GeoJSON(freguesias_bgri, {
    fillColor:'white',
    weight: 2,
    opacity: 1,
    color: '#424242',
    fillOpacity: 0.2,
  onEachFeature: function (feature, layer) {
    layer.on('mouseover', function () {
      this.setStyle({
        'fillColor': '#2E9AFE',
        'fillOpacity': 0.5,
      });
    });
    layer.on('mouseout', function () {
      this.setStyle({
        'fillColor': 'white',
        'fillOpacity': 0.2,
      });
    });
    let freg = feature.properties.Freguesia;
    let hab = feature.properties.RESIDENTS;
    let dens_pop = feature.properties.Dens_Pop;
    let analfabetos = feature.properties.ANALFAB;
    let desempregados = feature.properties. RES_PEMP;
    let escolar = feature.properties.RES_ENSC;
    let facu = feature.properties.RES_ENSS;
    let aloj = feature.properties.N_ALOJ;
    let aloj_vagos = feature.properties.N_ALO_VAG;
    let perim = feature.properties.Perimetro;
    let area = feature.properties.Area_Km2
    let idp = feature.properties.Id;
    let type = feature.geometry.type;
    let coord = feature.geometry.coordinates;
    layer.bindPopup('<h2> ' + freg + ' </h2><h4> DADOS SOCIAIS</h4><p>Habitantes: ' + hab + ' &nbsp; Dens. Populacional: ' + dens_pop + ' p/km²</p><p>Ensino Secundário: ' + escolar + ' &nbsp; Ensino Superior: ' + facu + '</p><p>Pop. Analfabeta: ' + analfabetos + ' &nbsp; Pop. Desempregada: ' + desempregados + '</p><h4> DADOS URBANÍSTICOS</h4><p>Nº Alojamentos: ' + aloj + ' &nbsp; Alojamentos Vagos: ' + aloj_vagos + '</p><h4> DADOS GEOMÉTRICOS</h4><p>Área: ' + area + ' km² &nbsp; Perímetro: ' + perim + ' km</p><p><strong>Fonte:</strong> Carta Administrativa Oficial de Portugal (2019) e Base Geográfica de Referenciação de Informação (2011)') 
  }
});

//_________________________________________________________________________________________________________________________________________________________//
//_________________________________________________________________________________________________________________________________________________________//

//Porto Subsecção

var Porto_Subseccao = new L.GeoJSON(bgri, {
    fillColor:'white',
    weight: 1.2,
    opacity: 1,
    color: '#424242',
    fillOpacity: 0.2,
  onEachFeature: function (feature, layer) {
    layer.on('mouseover', function () {
      this.setStyle({
        'fillColor': '#2E9AFE',
        'color': '#2E9AFE',
        'weight': '4'
      });
    });
    layer.on('mouseout', function () {
      this.setStyle({
        'fillColor': 'white',
        'color': '#424242',
        'weight': '1.2'
      });
    });
    let freg = feature.properties.Freguesia;
    let hab = feature.properties.RESIDENTS;
    let dens_pop = feature.properties.Dens_Pop;
    let analfabetos = feature.properties.ANALFAB;
    let desempregados = feature.properties. RES_PEMP;
    let escolar = feature.properties.RES_ENSC;
    let facu = feature.properties.RES_ENSS;
    let aloj = feature.properties.N_ALOJ;
    let aloj_vagos = feature.properties.N_ALO_VAG;
    let area = feature.properties.Area_ha;
    let perim = feature.properties.Perimetro;
    let idp = feature.properties.Id;
    let type = feature.geometry.type;
    layer.bindPopup('<h4> DADOS SOCIAIS</h4><p>Habitantes: ' + hab + ' &nbsp; Dens. Populacional: ' + dens_pop + ' p/km²</p><p>Ensino Secundário: ' + escolar + ' &nbsp; Ensino Superior: ' + facu + '</p><p>Pop. Analfabeta: ' + analfabetos + ' &nbsp; Pop. Desempregada: ' + desempregados + '</p><h4> DADOS URBANÍSTICOS</h4><p>Nº Alojamentos: ' + aloj + ' &nbsp; Alojamentos Vagos: ' + aloj_vagos + '</p><h4> DADOS GEOMÉTRICOS</h4><p>Área: ' + area + ' ha &nbsp; Perímetro: ' + perim + ' m</p><p><strong>Fonte:</strong> Base Geográfica de Referenciação de Informação (2011)') 
  }
}).addTo(map);


//_________________________________________________________________________________________________________________________________________________________//
//_________________________________________________________________________________________________________________________________________________________//

// Density Population

// Atribution Color

function getColor(Dens_Pop) {
  return Dens_Pop == 0.0 ? '#FFFFFF':
         Dens_Pop < 1200.0  ? '#F2F5A9' :
         Dens_Pop < 5000.0 ? '#F3F781' :
         Dens_Pop < 10000.0 ? '#F7D358' :
         Dens_Pop < 20000.0 ? '#FE9A2E' :
         Dens_Pop < 30000.0 ? '#FF4000' :
         Dens_Pop < 40000.0 ? '#DF0101' :
         Dens_Pop < 50000.0 ? '#B40404' :
                          '#8A0808';
}
function style(feature) {
  return {
      fillColor: getColor(feature.properties.Dens_Pop),
      weight: 0.8,
      opacity: 1,
      color: '#424242',
      fillOpacity: 0.7,
  };
}

//Add Interaction

function highlightFeature(e) {
  var density_hover = e.target;

  density_hover.setStyle({
      weight: 5,
      color: '#666',
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    density_hover.bringToFront();
  }

  info.update(density_hover.feature.properties);
}

function resetHighlight(e) {
  
 var density_hover = e.target;

 density_hover.setStyle({
  weight: 0.8,
  color: '#424242',
});

 info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      //click: zoomToFeature,
  });
  let freg = feature.properties.Freguesia;
  let hab = feature.properties.RESIDENTS;
  let dens_pop = feature.properties.Dens_Pop;
  let analfabetos = feature.properties.ANALFAB;
  let desempregados = feature.properties. RES_PEMP;
  let escolar = feature.properties.RES_ENSC;
  let facu = feature.properties.RES_ENSS;
  let aloj = feature.properties.N_ALOJ;
  let aloj_vagos = feature.properties.N_ALO_VAG;
  let area = feature.properties.Area_ha;
  let perim = feature.properties.Perimetro;
  let idp = feature.properties.Id;
  let type = feature.geometry.type;
  layer.bindPopup('<h4> DADOS SOCIAIS</h4><p>Habitantes: ' + hab + ' &nbsp; Dens. Populacional: ' + dens_pop + ' p/km²</p><p>Ensino Secundário: ' + escolar + ' &nbsp; Ensino Superior: ' + facu + '</p><p>Pop. Analfabeta: ' + analfabetos + ' &nbsp; Pop. Desempregada: ' + desempregados + '</p><h4> DADOS URBANÍSTICOS</h4><p>Nº Alojamentos: ' + aloj + ' &nbsp; Alojamentos Vagos: ' + aloj_vagos + '</p><h4> DADOS GEOMÉTRICOS</h4><p>Área: ' + area + ' ha &nbsp; Perímetro: ' + perim + ' m</p><p><strong>Fonte:</strong> Base Geográfica de Referenciação de Informação (2011)') 
}

var population = L.geoJson(bgri, {
  style: style,
  onEachFeature: onEachFeature,
});

//Custom Info Control

var info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed

info.update = function (props) {
    this._div.innerHTML = '<h4>Dens. Populacional</h4>' +  (props ?
        '<b> Residentes: </b>' + props.RESIDENTS + '<br/> <b>Hab/km<sup>2</sup>:</b></sup> ' + props.Dens_Pop + ' '
        : 'Hover over a layer');
};

//Legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1200.0, 5000.0, 10000.0, 20000.0, 30000.0, 40000.0, 50000.0],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

//Add and Remove legend

map.on('overlayadd', function (eventLayer) {
  if (eventLayer.name === 'Dens.Populacional') {
  this.removeControl(info);
  legend.addTo(this); 
  info.addTo(map);
} else {  
}});
map.on('overlayremove', function (eventLayer) {
  if (eventLayer.name === 'Dens.Populacional') {
  this.removeControl(legend);
  this.removeControl(info);
} else {
}});


//__________________________________________________________________________________________________________________________________________________________//
//__________________________________________________________________________________________________________________________________________________________//

// Porto COS - 2º nível

function getAreaColor(feature){
  console.log(feature)
  switch (feature.properties.COS2018_n4){
  case "1.1.1.1" : return '#FE9A2E' ; //Tecido edificado contínuo predominantemente vertical
  case "1.1.1.2" : return '#fff7bc' ; //Tecido edificado contínuo predominantemente horizontal
  case "1.1.3.1" : return '#A4A4A4' ; //Áreas de estacionamentos e logradouros
  case "1.1.2.1" : return '#F7BE81' ; //Tecido edificado descontínuo
  case "1.1.2.2" : return '#FAAC58' ; //Tecido edificado descontínuo esparso
  case "1.2.1.1" : return '#F7FE2E' ; //Indústria
  case "1.6.5.1" : return '#FF0000' ; //Outros equipamentos e instalações turísticas
  case "1.4.1.1" : return '#848484' ; //Rede viária e espaços associados
  case "1.5.3.1" : return '#FA5858' ; //Áreas em construção
  case "1.7.1.1" : return '#58FA82' ; //Parques e jardins
  case "1.6.4.1" : return '#585858' ; //Cemitérios
  case "1.6.1.2" : return '#A901DB' ; //Instalações desportivas
  case "1.6.3.1" : return '#FE2EF7' ; //Equipamentos culturais
  case "2.1.1.1" : return '#A5DF00' ; //Culturas temporárias de sequeiro e regadio
  case "2.3.2.1" : return '#00FF80' ; //Mosaicos culturais e parcelares complexos
  case "5.1.1.7" : return '#04B404' ; //Florestas de outras folhosas
  case "5.1.2.1" : return '#0B6121' ; //Florestas de Pinheiro Bravo
  case "6.1.1.1" : return '#64FE2E' ; //Matos
  case "9.1.1.1" : return '#2E9AFE' ; //Cursos de águas naturais
  case "5.1.1.3" : return '#088A29' ; //Floresta de outros carvalhos
  case "9.1.2.1" : return '#00BFFF' ; //Lagos e lagoas interiores artificiias
  case "9.3.3.1" : return '#013ADF' ; //Desembocaduras fluviais
  case "1.1.3.2" : return '#E6E6E6' ; //Espaços vazios sem construção
  case "1.4.1.2" : return '#424242' ; //Rede ferroviária e espaços associados
  case "2.3.3.1" : return '#04B486' ; //Agricultura com espaços naturais e seminaturais
  case "5.1.1.5" : return '#088A4B' ; //Florestas de eucalípto
  case "2.2.2.1" : return '#4B8A08' ; //Pomares
  case "2.4.1.1" : return '#AEB404' ; //Agricultura protegida e viveiros
  case "1.2.3.1" : return '#A9F5A9' ; //Instalações agrícolas
  case "7.1.1.2" : return '#F3F781' ; //Praias, dunas e areias costeiras
  case "1.4.2.1" : return '#424242' ; //Terminais portuários
  case "1.2.2.1" : return '#BCA9F5' ; //Comércio
  case "1.4.3.2" : return '#00FFFF' ; //Aeródromos
  case "1.6.2.2" : return '#FF0080' ; //Equipamentos de lazer
  case "9.3.4.1" : return '#0404B4' ; //Oceano
  case "7.1.2.1" : return '#61380B' ; //Rocha nua
}};

function areaStyle(feature){
  return {
  fillColor: getAreaColor(feature),
  weight: 0.4,
  opacity: 1,
  color: "#424242",
  fillOpacity: 0.7}
};

var ocupsolo = L.geoJSON(cos,{
  style:areaStyle,
  onEachFeature: function (feature, layer) {
  layer.on('mouseover', function () {
    this.setStyle({
      'fillColor': getAreaColor(feature)+'50',
      //'color': 'white',
      'weight': '1'
    });
  });
  layer.on('mouseout', function () {
    this.setStyle({
      'fillColor': getAreaColor(feature),
      //'color': '#424242',
      'weight': '0.4'
    });
  });  
  let tip = feature.properties.COS2018_Lg;
  let area = feature.properties.Area_ha;
  let idp = feature.properties.Id;
  let type = feature.geometry.type
  let coord = feature.geometry.coordinates
  layer.bindPopup('<p><strong>Tipo</strong>: ' + tip + '</p><p><strong>Área</strong>: ' + area + ' ha</p><p><strong>Fonte</strong>: Carta de Ocupação do Solo (2018)</p>')
   
}});

//__________________________________________________________________________________________________________________________________________________________//
//__________________________________________________________________________________________________________________________________________________________//

// Órgãos de Segurança

// Esquadras Ativas
var bluepoint = {
  radius: 6,
  fillColor: "#2E9AFE",
  color: "#FFFFFF",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var esquadras_ativas = L.geoJSON(esquadras,{
  onEachFeature: function (feature, layer) { 
      let dom = feature.properties.name;
      let end = feature.properties.endereco;
      let post = feature.properties.ctt;
      let type = feature.geometry.type;
      let coord = feature.geometry.coordinates;
      layer.bindPopup('<h2><img src="./Image/PSP_Brasao.png"width="33"height="40"> &nbsp;Esquadra de Polícia</h2><p><strong>Denominação</strong>: ' + dom + '</p> <p><strong>Endereço</strong>: ' + end + '</p> <p><strong>CTT</strong>: ' + post + '</p><p><strong>Fonte</strong>: Base de dados da Polícia de Segurança Pública (PSP)</p>');
  },
  pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng, bluepoint);
  },
});

//__________________________________________________//

// Outras Instalações
var blue_darkpoint = {
  radius: 6,
  fillColor: "#084B8A",
  color: "#FFFFFF",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var instalacoes = L.geoJSON(psp_outros,{
  onEachFeature: function (feature, layer) { 
      let dom = feature.properties.name;
      let end = feature.properties.endereco;
      let post = feature.properties.ctt;
      let type = feature.geometry.type
      let coord = feature.geometry.coordinates
      layer.bindPopup('<h2><img src="./Image/PSP_Brasao2.png"width="34"height="38"> Outras instalações</h2><p><strong>Denominação</strong>: ' + dom + '</p> <p><strong>Endereço</strong>: ' + end + '</p> <p><strong>CTT</strong>: ' + post + '</p><p><strong>Fonte</strong>: Base de dados da Polícia de Segurança Pública (PSP)</p>');
  },
  pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng, blue_darkpoint);
  },
});

//__________________________________________________//

// Bombeiros
var red_point = {
  radius: 6,
  fillColor: "red",
  color: "#FFFFFF",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var fire = L.geoJSON(bombeiros,{
  onEachFeature: function (feature, layer) { 
      let dom = feature.properties.NOME;
      let end = feature.properties.MORADA;
      let post = feature.properties.CTT;
      let tel = feature.properties.TELEFONE;
      let type = feature.geometry.type
      let coord = feature.geometry.coordinates
      layer.bindPopup('<h2><img src="./Image/Bombeiros_logo.png"width="34"height="38"> Corpo de Bombeiro</h2><p><strong>Denominação</strong>: ' + dom + '</p> <p><strong>Endereço</strong>: ' + end + '</p> <p><strong>CTT</strong>: ' + post + '</p><p><strong>Fonte</strong>: Base de dados da Polícia de Segurança Pública (PSP)</p>');
  },
  pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng, red_point);
  },
});

//__________________________________________________//

var segurança = L.layerGroup ([instalacoes, esquadras_ativas, fire]);

//__________________________________________________//

// Legend
var legend_psp = L.control({ position: "bottomright" });
            legend_psp.onAdd = function(map) {
                var div = L.DomUtil.create("div", "legenda_psp");
                    //div.innerHTML += "<h4>Legenda</h4>";
                    div.innerHTML += "<h4>Equipamentos</h4>";
                    div.innerHTML += '<i style="background: #2E9AFE"></i><span> Esquadras Ativas </span><br>';
                    div.innerHTML += '<i style="background: #084B8A"></i><span> Outras Instalações </span><br>';
                    div.innerHTML += '<i style="background: #FF0000"></i><span> Bombeiros </span><br>';

                return div;
            };
            map.on('overlayadd', function (eventLayer) {
              if (eventLayer.name === 'Segurança Pública') {
              legend_psp.addTo(this); 
          } else {  
          }});
          map.on('overlayremove', function (eventLayer) {
              if (eventLayer.name === 'Segurança Pública') {
              this.removeControl(legend_psp); 
          } else {
          }});

//__________________________________________________//

// Rasters

// Topo Raster

var topo_raster = L.imageOverlay ('./Image/Topo_Raster.png', [[41.1383506797128007, -8.6912940694204384],[41.1859353051988961, -8.5526134550583333]], {opacity:0.8});

// Legend
var legend_topo = L.control({ position: "bottomright" });
            legend_topo.onAdd = function(map) {
                var div = L.DomUtil.create("div", "legenda_topo");
                    div.innerHTML += "<h4>Elevação<br>Metros</h4>";
                    //div.innerHTML += "<h4>Metros</h4>";
                    div.innerHTML += '<i style="background: red"></i><span> 163,655 </span><br>';
                    div.innerHTML += '<i style="background: orange"></i><span> 119,411 </span><br>';
                    div.innerHTML += '<i style="background: yellow"></i><span> 75,167 </span><br>';
                    div.innerHTML += '<i style="background: #A5DF00"></i><span> 44,244 </span><br>';
                    div.innerHTML += '<i style="background: green"></i><span> -13,321 </span><br>';

                return div;
            };
            map.on('overlayadd', function (eventLayer) {
              if (eventLayer.name === 'DEM') {
              legend_topo.addTo(this); 
          } else {  
          }});
          map.on('overlayremove', function (eventLayer) {
              if (eventLayer.name === 'DEM') {
              this.removeControl(legend_topo); 
          } else {
          }});

//____________________________________________________//

// Slope

var slope = L.imageOverlay ('./Image/Slope.png', [[41.1383506797128007, -8.6912940694204384],[41.1859353051988961, -8.5526134550583333]], {opacity:0.6});

// Legend
var legend_slope = L.control({ position: "bottomright" });
            legend_slope.onAdd = function(map) {
                var div = L.DomUtil.create("div", "legenda_slope");
                    div.innerHTML += "<h5>Declive<br>Graus</h5>";
                    div.innerHTML += '<i style="background: red"></i><span> 53,45 </span><br>';
                    div.innerHTML += '<i style="background: orange"></i><span> 26,72 </span><br>';
                    div.innerHTML += '<i style="background: yellow"></i><span> 0 </span><br>';

                return div;
            };
            map.on('overlayadd', function (eventLayer) {
              if (eventLayer.name === 'Declive') {
              legend_slope.addTo(this); 
          } else {  
          }});
          map.on('overlayremove', function (eventLayer) {
              if (eventLayer.name === 'Declive') {
              this.removeControl(legend_slope); 
          } else {
          }});


//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

// Add Zoom Bar
var zoom_bar = new L.Control.ZoomBar({position: 'topleft'}).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Draw Tools

/*var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(
  {
    draw: {
      polygon: {
        shapeOptions: {
          color: 'yellow'
        },
        allowIntersection: false,
        drawError: {
            color: 'red',
            timeout: 1000,
            //message: '<strong>Oh snap!<strong> you can\'t draw that!'
        },
        showArea: true,
        metric: false,
        //repeatMode: true
      },
      polyline: {
        shapeOptions: {
          color: 'red'
        },
      },
      rectangle : {
        shapeOptions: {
          color: '#00FF80'
        },
      },
      circle: {
        shapeOptions: {
          color: '#2EFEF7'
        },
      },
    },
    edit: {
      featureGroup: drawnItems,
    }
  }
);
map.addControl(drawControl);
map.on('draw:created', function (e) {
  var type = e.layerType,
  layer = e.layer;
  if (type === 'marker') {
  layer.bindPopup('A popup!');
  }
  drawnItems.addLayer(layer);
});*/

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Add Ruler

var options = {
    position: 'topleft',
    circleMarker: {               // Leaflet circle marker options for points used in this plugin
        color: 'red',
        radius: 2
      },

    lineStyle: {                  // Leaflet polyline options for lines used in this plugin
        color: 'red',
        dashArray: '1,6'
      },

    lengthUnit: {
      //factor: '0.539956803',     //  from km to nm
      display: 'km',
      decimal: 3,
      factor: null,
      label: 'Distance',
    },

    angleUnit: {
        display: '&deg;',        // This is the display value will be shown on the screen. Example: 'Gradian'
        decimal: 3,              // Bearing result will be fixed to this value.
        factor: null,            // This option is required to customize angle unit. Specify solid angle value for angle unit. Example: 400 (for gradian).
        label: 'Bearing:'
      }
  };
  
L.control.ruler(options).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Layers Control

//Dados Geográficos

var layers1 ={}

var layers2 ={
  'Dados Geográficos': {
    'Freguesias': porto_freguesias,
    'Subsecção': Porto_Subseccao,
    'COS': ocupsolo,
    'Elevação': topo_raster,
    'Declive': slope,
    'Dens.Populacional':population,
  //'Segurança Pública': segurança,
  }
};

L.control.groupedLayers(layers1, layers2, {collapsed:false}).addTo(map);


//__________________________________________________//

//Dados Crime

var layers1_5 ={}

var layers2_5 ={
  'Dados Crime': {
    'Segurança Pública': segurança,
  }
};

L.control.groupedLayers(layers1_5, layers2_5, {collapsed:false, position: 'topright'}).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Add Scale
L.control.scale().addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Grid

L.latlngGraticule({
  showLabel: true,
  dashArray: [2, 2],
  zoomInterval: [
      {start: 2, end: 3, interval: 30},
      {start: 4, end: 4, interval: 10},
      {start: 5, end: 7, interval: 5},
      {start: 8, end: 10, interval: 1}
  ]
}).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//

//Basemap Control

var layers3 = [];


var providerimaginary = {
  title: 'Imaginary',
  icon: './Basemap/Img_icon/Imaginary.png',
  layer: Imaginary_street
}
var providerosm = {
  title: 'OSM',
  icon: './Basemap/Img_icon/openstreetmap.png',
  layer: OpenStreetMap
}
var providerdark = {
  title: 'Dark',
  icon: './Basemap/Img_icon/Darkmap.png',
  layer: darkmap
}
var providertopo = {
  title: 'OTM',
  icon: './Basemap/Img_icon/TopoMap.png',
  layer: OpenTopoMap
}

layers3.push(providerimaginary);
layers3.push(providerosm);
layers3.push(providerdark);
layers3.push(providertopo);

var ctrl = L.control.iconLayers(layers3).addTo(map);

//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//   

//Geocode Address

/*var bingGeocoder = new L.Control.BingGeocoder('AiKnhK-3Jltdu8Vs_UZC9V7qjs8VS_cqPb5aj_fOyjOq1stkwP89tJxa6kSN9uNr');
map.addControl(bingGeocoder);*/

var geocoder = L.Control.geocoder({
  position:'topleft',
  //defaultMarkGeocode: false,
  //collapsed: false
})

.addTo(map);


//**********************************************************************************************************************************************************//
//**********************************************************************************************************************************************************//   
