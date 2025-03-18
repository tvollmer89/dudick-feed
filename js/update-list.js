/**
 * 
 * @param {object} oldList - original list from DPM XML
* @return {array} new product list as JSON object
 */
const updateList = oldList => {
  let date = new Date();
  let prodList = [];
  let newList = {"date": date.toLocaleDateString('en-US'), "dateFull": date.toString()};
  oldList.forEach((p) => {
    
    let types = setProdInfo(p, "producttypes", "producttype", "type");
    let applications = setProdInfo(p, "prodapplications", "application", "application");
    let markets = setProdInfo(p, "prodmarkets", "market", "market");
    let f = setProdInfo(p, "productfeatures", "productfeature", "feature");
    let docs = p.hasOwnProperty("linklocations") ? setProdLinks(p.linklocations.linklocation, p.linktitles.linktitle) : [];

    let newProd = {
      name: p.productname,
      id: p.productcode,
      family: p.productfamily,
      types: types,
      applications: applications,
      markets: markets,
      features: f,
      links: docs,
      genericType: p.generictype,
      designation: `${p.productdesignation} ${p.productdesignationfooter}`,
      description: p.productdescription,
      productfinish: p.productfinish,
      productdfts: p.productdfts,
      solidscontent: p.solidscontent,
      solidsmeasurement: p.solidsmeasurement,
      solidsvalue: p.solidsvalue,
      vocvalues: p.vocvalues,
      dtrs: p.dtrs,
      ratio: p.ratio,
      potlife: p.potlife,
      potlifecomments: p.potlifecomments,
      cureschedule: p.cureschedule,
      locale: p["@_locale"]
      
    };
    prodList.push({"product": newProd})
  })
  newList.prodCount = prodList.length;
  newList.products = prodList;

  let list = JSON.stringify(newList, undefined, 2);
  document.getElementById("feed-container").innerHTML = list;
  return newList;
}

/**
 * 
 * @param {object} prod the current product object
 * @param {string} groupName 
 * @param {string} itemName 
 * @param {string} label a friendlier name for the given detail 
 * @returns an array of object formatted to display all detail items correctly
 */
const setProdInfo = (prod, groupName, itemName, label) => {
  let detail = [];
  let d = "";
  if(groupName == "prodapplications" && prod[groupName].hasOwnProperty(itemName)){
    // TODO: Ignore Misc. 
    // !If Misc is absolutely required, just change the replace to say "Misc" or whatever
    d = prod[groupName][itemName].toString().replace("Misc (grouts, fillers, caulks, tapes, sealers)", "");
    console.log(`application: ${d}`)
  } else if (groupName == "prodmarkets" && prod[groupName].hasOwnProperty(itemName)) {
    console.log(`groupName: ${groupName}, itemName: ${itemName} - ${prod[groupName][itemName].toString()}`)
    let marketList = prod[groupName][itemName].toString().split(',');
    let mList = marketList.map(m => {
      switch(m){
        case "Automotive":
        case "Electronics":
          return "Semiconductor & EV";
        case "Chemical Processing/Refining":
        case "Petrochemical":
          return "Chemical Processing";
        case "Commercial &amp; Architectural":
          return "Healthcare";
        case "Flooring":
        case "Distributor":
        case "Metals &amp; Mining":
        case "Power - Thermal Fuel":
        case "Water &amp; Wastewater":
        case "Pulp &amp; Paper":
        case "Oil &amp; Gas Midstream":
        case "Government/Military":
        case "Secondary Containment":
        case "Storage Tanks":
        case "OEM":
        case "Multiple Markets":
        case "Power - Nuclear":
          return "Other";
        default:
          return m;
      }
    })
    let unique = [...new Set(mList)];
    console.log(`unique: ${unique}`)
    d = unique.filter(x => x != "").toString();
    console.log(`d: ${d}`)
    
  } else {

    // *just trying to fix the special character problem 
    // if(prod[groupName].hasOwnProperty(itemName)) {
    //   d = prod[groupName][itemName].toString().replace("Polyureas", \u0026);

    //   d = prod[groupName][itemName].toString().replace(/\s\&\s/i, " &amp; ");
    // } else {
    //   d = "";
    // }
    d = !prod[groupName].hasOwnProperty(itemName) ? "" : prod[groupName][itemName].toString();
  }
  detail = d == "" ? [] : d.split(",").map(t => {
    let obj = {};
    obj[label] = t;
    return obj;
  })
  console.log(`detail: ${JSON.stringify(detail)}`)
  return detail;
}

const setProdLinks = (prodLinks, linkTitles) => {
  let linkInfo = Array.isArray(prodLinks) ? [...prodLinks] : [prodLinks];
  let titles = typeof linkTitles == "string" ? [linkTitles] : linkTitles
  let links = [];
  for (const t in titles) {
    let link = {
      "link": {
        "name": titles[t],
        "@_url": linkInfo[t]["#text"],
        "@_type": linkInfo[t]["@_resource-type"]
      }
    }
    links.push(link)
  }
  // linkTitles.forEach(title => links.push({"name": title}));
  return links;
}

export {updateList}