const MAIN_MENU_ID = 'TechdicerMenuId';

// We're goign to load the techdicer.js which is common javascript injected
// into content pages and to this page.   The issue though is... background.js
// is a headless page... it doesn't have a DOM nor a Window object.   So to 
// work around this we are creating a fake window object so when the script
// is imported it has something to attach itself to.  To use the function in 
// there you say window.$Techdicer.somefunction()  
var window = {};
importScripts('library/techdicer.js');
importScripts('library/jszip.min.js');

// This is used to inject html into the Salesforce page when the screen loads. 
// There are are probably going to times when this isn't good enough and I'll 
// need to look for url changes. 
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {

    // These could have been setup in the manifest but I prefer to inject
    // them via code to have a bit more control.  This is demonstrating
    // injecting both a file and function.
    if (tab.url.includes('.force.com/')) {
      // techdicer.js is the big one that has all sorts of reusable things.  
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['library/techdicer.js']
      });

      // this is showing how to inject just a function. 
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: addMainMenuToSalesforcePage,
        args: [ MAIN_MENU_ID ]
      });
    }
  }

});

// Might be used in the future... if not I'll delete it.
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Keep in mind that when a function is injected via chrome.scripting.executeScript
// It is putting a copy of the script into the dom.  Because of this... the script 
// needs to be self contained. 
function addMainMenuToSalesforcePage(menuId) {
  var techdicerMenu = document.getElementById(menuId);
  if(!techdicerMenu){
    // Only add the menu if it doesn't already exist.   Sort of a pointless
    // check... but I suppose if someone creates a second extension that happens
    // to add ths same div tag id then bad things would happen.   Maybe the 
    // the div id should be more of random thing... or make use the exensions unique id.
    techdicerMenu = document.createElement('div');
    techdicerMenu.id = menuId;
    techdicerMenu.className = 'techdicerext-menu';

    // Add the menu to the screen. 
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(techdicerMenu);


    var content = document.createElement('div');
    content.innerHTML = (`
          <div id="myModal" class="techdicerext-modall slds-hide">
          <section role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="modal-heading-01" class="slds-modal slds-fade-in-open slds-modal_large sldsModel">
              <div class="slds-modal__container">
                  <button class="slds-button slds-button_icon slds-modal__close" id="techdicerext-modal-close-button">
                      <svg class="slds-icon slds-icon-text-default" aria-hidden="true">
                          <use xlink:href="/_slds/icons/utility-sprite/svg/symbols.svg#close"></use>
                      </svg>
                      <span class="slds-assistive-text">Cancel and close</span>
                  </button>
                  <div class="slds-modal__header">
                      <h1 id="modal-heading-01" class="slds-modal__title slds-hyphenate" tabindex="-1">Techdicer TollBox</h1>
                  </div>
                  <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1" style="position: relative;">
                      <div class="demo-only slds-hide">
                          <div class="slds-spinner_container">
                              <div role="status" class="slds-spinner slds-spinner_medium slds-spinner_brand">
                                  <span class="slds-assistive-text">Loading</span>
                                  <div class="slds-spinner__dot-a"></div>
                                  <div class="slds-spinner__dot-b"></div>
                              </div>
                          </div>
                      </div>
                      <div class="slds-tabs_default">
                          <ul class="slds-tabs_default__nav" role="tablist">
                              <li class="slds-tabs_default__item slds-active" title="Item One" role="presentation">
                                  <a class="slds-tabs_default__link" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Object List</a>
                              </li>
                              <li class="slds-tabs_default__item" title="Item Two" role="presentation">
                                  <a class="slds-tabs_default__link" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Salesforce LIMIT</a>
                              </li>
                              <li class="slds-tabs_default__item" title="Item Three" role="presentation">
                                  <a class="slds-tabs_default__link" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Salesforce REST API</a>
                              </li>
                              <li class="slds-tabs_default__item" title="Item Three" role="presentation">
                                  <a class="slds-tabs_default__link" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-4" id="tab-default-4__item">Fetch Query Data</a>
                              </li>
                          </ul>
                          <div id="tab-default-1" class="slds-tabs_default__content slds-show" role="tabpanel" aria-labelledby="tab-default-1__item">
                              <div id="techdicerext-button-get-objects" class="slds-button  slds-button_brand">Get Object List</div>
                              <br/>
                              <div class="slds-scrollable_y" tabindex="0" style="margin-top: 15px;">
                                  <table class="slds-table slds-table_cell-buffer slds-table_bordered" aria-label="Example default base table of Opportunities" id="myTablesObject">
                                      <thead>
                                          <tr class="slds-line-height_reset">
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Name">Object Name</div>
                                              </th>
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Max Limit">Object API Name</div>
                                              </th>
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Remaining">Remaining</div>
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>

                                      </tbody>
                                  </table>
                              </div>
                              <br/>
                          </div>
                          <div id="tab-default-2" class="slds-tabs_default__content slds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">
                              <div id="techdicerext-button-get-salesforce-limit" class="slds-button  slds-button_brand">Get Limit List</div>
                              <br/>

                              <div class="slds-scrollable_y" tabindex="0" style="margin-top: 15px;">
                                  <table class="slds-table slds-table_cell-buffer slds-table_bordered" aria-label="Example default base table of Opportunities" id="myTables">
                                      <thead>
                                          <tr class="slds-line-height_reset">
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Name">Name</div>
                                              </th>
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Max Limit">Max Limit</div>
                                              </th>
                                              <th class="" scope="col">
                                                  <div class="slds-truncate" title="Remaining">Remaining</div>
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>

                                      </tbody>
                                  </table>
                              </div>
                              <br/>
                          </div>
                          <div id="tab-default-3" class="slds-tabs_default__content slds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">
                              
                              
                              <div class="slds-scrollable_y" tabindex="0" style="margin-top: 15px;">
                              <div class="container">
                                <div class="slds-card">
                                  <div class="slds-card__header slds-grid">
                                    <div class="slds-media slds-media_center slds-has-flexi-truncate">
                                      <div class="slds-media__body">
                                        <h2 class="slds-card__header-title">
                                          <span>Salesforce REST Explorer</span>
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div class="slds-card__body">
                                    <!-- Form for API Endpoint and Request -->
                                    <div id="restExplorerForm" class="slds-form">
                                      <div class="slds-form-element">
                                        <label class="slds-form-element__label" for="apiEndpoint">API Endpoint:</label>
                                        <div class="slds-form-element__control">
                                          <input type="text" id="apiEndpoint" class="slds-input" placeholder="e.g., /services/data/v54.0/sobjects/Account" value="/services/data/v54.0/sobjects/Account" required>
                                        </div>
                                      </div>
                                      
                                      <div class="slds-form-element">
                                        <label class="slds-form-element__label" for="httpMethod">HTTP Method:</label>
                                        <div class="slds-form-element__control">
                                          <div class="slds-select_container">
                                            <select id="httpMethod" class="slds-select">
                                              <option value="GET">GET</option>
                                              <option value="POST">POST</option>
                                              <option value="PATCH">PATCH</option>
                                              <option value="DELETE">DELETE</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Request Body for POST/PATCH -->
                                      <div class="slds-form-element" id="requestBodySection">
                                        <label class="slds-form-element__label" for="requestBody">Request Body (for POST/PATCH):</label>
                                        <div class="slds-form-element__control">
                                          <textarea id="requestBody" class="slds-textarea" placeholder='{"Name": "New Account"}'></textarea>
                                        </div>
                                      </div>

                                      <div id="techdicerext-button-rest-salesforce" class="slds-button slds-button_brand slds-m-top_medium">Submit</div>
                                    </div>

                                    <!-- Display Response -->
                                    <div id="responseSection" class="slds-m-top_large">
                                      <h3>Response</h3>
                                      <div class="result-area">
                                        <textarea id="responseContent" class="slds-textarea textareaData" readonly>Response will appear here...</textarea>
                                      </div>
                                    </div>
          
                                  </div>
                                </div>
                              </div>
                              </div>
                          </div>
                          <div id="tab-default-4" class="slds-tabs_default__content slds-show" role="tabpanel" aria-labelledby="tab-default-4__item">
                              
                              
                              <div class="slds-scrollable_y" tabindex="0" style="margin-top: 15px;">
                                  <div class="container">
                                    <div class="slds-card">
                                        <div class="slds-card__header slds-grid">
                                          <div class="slds-media slds-media_center slds-has-flexi-truncate">
                                            <div class="slds-media__body">
                                              <h2 class="slds-card__header-title">
                                                <span>Salesforce Query Explorer</span>
                                              </h2>
                                            </div>
                                          </div>
                                        </div>
                                      
                                        <div class="slds-card__body">
                                          <!-- Form for API Endpoint and Request -->
                                          <div id="restExplorerForm" class="slds-form">
                                            <div class="slds-form-element">
                                              <label class="slds-form-element__label" for="apiEndpoint">Query Editor:</label>
                                              <div class="slds-form-element__control">
                                              <textarea id="queryBody" class="slds-textarea" placeholder='Select Id FROM Account LIMIT 10' value="Select Id FROM Account LIMIT 10"></textarea>
                                              </div>
                                            </div>
                                            <div id="techdicerext-button-get-Query-Data" class="slds-button  slds-button_brand">Fetch Query Data</div>
                                          </div>

                                          <!-- Display Response -->
                                          <div id="responseSection" class="slds-m-top_large">
                                            <h3>Response</h3>
                                            <div class="result-area">
                                              
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                           </div>
                         </div>
                    </div>
          </section>
          <div class="slds-backdrop slds-backdrop_open" role="presentation"></div>
      </div>
    `)

    techdicerMenu.appendChild(content);

    // Add a handler so we can do things when the user clicks the UI we added. 
    techdicerMenu.addEventListener('click', function(e) {
      var modal = document.querySelector('.techdicerext-modall');
      modal.classList.add('slds-show');
      modal.classList.remove('slds-hide');
      
      // $Techdicer is available because it was also injected.  Just keep in mind
      // the instance of $Techdicer is a different instance that is alive within the 
      // running background.js.  
    });
  
    // Handle when the user clicks a tab.
    document.querySelectorAll('.slds-tabs_default__link').forEach(item => {
      item.addEventListener('click', event => {
        $Techdicer.sldsSwitchTab(event);
      })
    })

    // Demonstrating putting something into the cliipboard.
    /*var copyButton = document.querySelector('#techdicerext-button-fls-copy');
    copyButton.addEventListener('click', function(e) {

      try {
        const content = document.querySelector('#techdicerext-content-fls').innerHTML;
        const blob = new Blob([content], {type: 'text/html'});
        const item = new ClipboardItem({'text/html' : blob});
        navigator.clipboard.write([item]);
      } catch(e) {
        console.log(e);
      }

    });*/

    /*copyButton = document.querySelector('#techdicerext-button-objectlist-copy');
    copyButton.addEventListener('click', function(e) {

      try {
        const content = document.querySelector('#techdicerext-content-objectlist').innerHTML;
        const blob = new Blob([content], {type: 'text/html'});
        const item = new ClipboardItem({'text/html' : blob});
        navigator.clipboard.write([item]);
      } catch(e) {
        console.log(e);
      }
 
    });*/

    var handleOptChange = document.querySelector('#httpMethod');
    if (handleOptChange) {
      handleOptChange.addEventListener('change', function(e) {
        console.log(e);

        const httpMethod = document.getElementById('httpMethod').value;
        const requestBodySection = document.getElementById('requestBodySection');

        // Show the request body for POST and PATCH methods, hide for GET and DELETE
        if (httpMethod === 'POST' || httpMethod === 'PATCH') {
          requestBodySection.style.display = 'block';
        } else {
          requestBodySection.style.display = 'none';
        }
      })
    }
    
    var getRestButton = document.querySelector('#techdicerext-button-rest-salesforce');

    if (getRestButton) {
      getRestButton.addEventListener('click', function(e) {
        var modalSpinner = document.querySelector('.demo-only');
        modalSpinner.classList.add('slds-show');
        modalSpinner.classList.remove('slds-hide');
        
        const apiEndpoint = document.getElementById('apiEndpoint').value;
        const httpMethod = document.getElementById('httpMethod').value;
        const requestBody = document.getElementById('requestBody').value;

        chrome.runtime.sendMessage({action: $Techdicer.MESSAGES.GET_SESSION}, function(session) {
          $Techdicer.getSalesforceRestResponse(session.domainAPI, session.sid, apiEndpoint, httpMethod, requestBody, function(response){

            modalSpinner.classList.remove('slds-show');
            modalSpinner.classList.add('slds-hide');
            document.getElementById('responseContent').textContent = JSON.stringify(response, null, 2);
          });
        });
      });
    } 

    var getQueryDataButton = document.querySelector('#techdicerext-button-get-Query-Data');

    if (getQueryDataButton) {
      getQueryDataButton.addEventListener('click', function(e) {
        var modalSpinner = document.querySelector('.demo-only');
        modalSpinner.classList.add('slds-show');
        modalSpinner.classList.remove('slds-hide');
        
        const query = document.getElementById('queryBody').value;

        chrome.runtime.sendMessage({action: $Techdicer.MESSAGES.GET_SESSION}, function(session) {
          $Techdicer.getSalesforceQueryResult(session.domainAPI, session.sid, query, function(response){

            modalSpinner.classList.remove('slds-show');
            modalSpinner.classList.add('slds-hide');
            console.log(response);
            //document.getElementById('responseContent').textContent = JSON.stringify(response, null, 2);
          });
        });
      });
    }

    // Demonstrating getting data via test.  Not really doing anything productive with the data yet.
    var getObjectsButton = document.querySelector('#techdicerext-button-get-objects');
    if (getObjectsButton) {
      getObjectsButton.addEventListener('click', function(e) {
        var modalSpinner = document.querySelector('.demo-only');
        modalSpinner.classList.add('slds-show');
        modalSpinner.classList.remove('slds-hide');
        //var modalcontent = document.querySelector('#techdicerext-content-objectlist').innerHTML;
        var tableRef = document.getElementById('myTablesObject').getElementsByTagName('tbody')[0];
        tableRef.innerHTML = "";
        //modalcontent.innerHTML = 'Getting objects...';
        chrome.runtime.sendMessage({action: $Techdicer.MESSAGES.GET_SESSION}, function(session) {
          $Techdicer.getSobjects(session.domainAPI, session.sid, function(getObjectsResponse){
            // This is a describe of all the objects in the org.
            //tableRef.remove();
            modalSpinner.classList.remove('slds-show');
            modalSpinner.classList.add('slds-hide');

            getObjectsResponse.data.sobjects.map(objectDescribe => {
              let trd = '<tr class="slds-hint-parent">';
              trd += `<td data-label="Name">
                      <div class="slds-truncate" title="Cloudhub">${objectDescribe.label}</div>
                      <td data-label="Close Date">
                      <div class="slds-truncate" title="">${objectDescribe.name}</div>
                      </td>
                      <td data-label="Prospecting">
                      <div class="slds-truncate" title="Prospecting">${objectDescribe.name}</div>
                      </td>
                      </tr>
                    </td>`
                    tableRef.insertRow().innerHTML = trd;
            } )
          });
        });
      });
    }

    var getSalesforceLimitButton = document.querySelector('#techdicerext-button-get-salesforce-limit');
    if (getSalesforceLimitButton) {
      getSalesforceLimitButton.addEventListener('click', function(e) {
        var modalSpinner = document.querySelector('.demo-only');
        modalSpinner.classList.add('slds-show');
        modalSpinner.classList.remove('slds-hide');
        //var modalcontent = document.querySelector('#techdicerext-content-objectlist').innerHTML;
        var tableRef = document.getElementById('myTables').getElementsByTagName('tbody')[0];
        tableRef.innerHTML = "";
        //modalcontent.innerHTML = 'Getting objects...';
        chrome.runtime.sendMessage({action: $Techdicer.MESSAGES.GET_SESSION}, function(session) {
          $Techdicer.getSalesforceLimits(session.domainAPI, session.sid, function(getObjectsResponse){
            // This is a describe of all the objects in the org.
            //modalcontent.innerHTML = '';
            modalSpinner.classList.remove('slds-show');
            modalSpinner.classList.add('slds-hide');
            Object.keys(getObjectsResponse.data).map(function (key) {
                let trd = '<tr class="slds-hint-parent">';
                trd += `<td data-label="Name">
                        <div class="slds-truncate" title="Cloudhub">${key}</div>
                        <td data-label="Close Date">
                        <div class="slds-truncate" title="">${getObjectsResponse.data[key].Max}</div>
                        </td>
                        <td data-label="Prospecting">
                        <div class="slds-truncate" title="Prospecting">${getObjectsResponse.data[key].Remaining}</div>
                        </td>
                        </tr>
                      </td>`
                      tableRef.insertRow().innerHTML = trd;
                //modalcontent.innerHTML += trd;//key + '  Max Limit : ' + getObjectsResponse.data[key].Max + ' Remaining : ' + getObjectsResponse.data[key].Remaining + '\n';
            });
          });
        });
      });
    }

    // This is a big mess of a function and needs to be refactored.
    // Here's what it's doing...
    //   1. Get the objects in the org via REST. 
    //   2. Submit a metadata API retrieve call via SOAP. 
    //   3. Check the status of the retrie800ve call via SOAP.
    //   4. Decode/Unzip the zipfile received. 
    //   5. Loop the data a build single object.
    //   6. Output the single object as an html table.  
    var flsButton = document.querySelector('#techdicerext-button-fls');
    if (flsButton) {
      flsButton.addEventListener('click', function(e) {
        var modalcontent = document.querySelector('#techdicerext-content-fls');
        modalcontent.innerText = 'Getting object list...';
        chrome.runtime.sendMessage({action: $Techdicer.MESSAGES.GET_SESSION}, function(session) {
          $Techdicer.getSobjects(session.domainAPI, session.sid, function(getObjectsResponse){
            var metaTypes = [];

            metaTypes.push({ name: 'CustomObject', members: '*' });
            metaTypes.push({ name: 'Profile',      members: '*' });
            getObjectsResponse.data.sobjects.forEach(function(objectDescribe) {
               metaTypes.push({ name: 'CustomObject', members: objectDescribe.name });
            })

            modalcontent.innerText = 'Retrieve...';
            chrome.runtime.sendMessage (
              {action: $Techdicer.MESSAGES.METADATA_RETRIEVE,
               session: session,
                metaTypes: metaTypes
              }, 
               function(retrieveResponse) {
                 console.log(retrieveResponse);
                 // since this copy of the function is running in browser we should have
                 // a DOMParse available.
                 var domParser = new DOMParser();
                 var xmlDocument = domParser.parseFromString(retrieveResponse.data, "text/xml");
                 var resultNode = xmlDocument.getElementsByTagName('result')[0];
                 var idNode = resultNode.getElementsByTagName('id')[0];
                 var metadataRetrieveJobId = idNode.innerHTML;
 
                 modalcontent.innerText = `Job id from the retrieve is ${metadataRetrieveJobId}.  Fetching in 5 seconds.`;

                 var attemptCounter = 0;
                 var intervalId = setInterval( function(jobId){
                   attemptCounter++;
                   console.log(`setInterval for ${jobId}`);
 
                   chrome.runtime.sendMessage (
                     {action: $Techdicer.MESSAGES.METADATA_CHECKRETRIEVESTATUS,
                      session: session,
                      asyncProcessId: jobId}, 
                      function(checkRetrieveStatusResponse) { 
                         var xmlDocument = domParser.parseFromString(checkRetrieveStatusResponse.data, "text/xml");
                         var resultNode = xmlDocument.getElementsByTagName('result')[0];
                         var doneValue= resultNode.getElementsByTagName('done')[0].innerHTML;
                         if (doneValue != 'true') {
                           modalcontent.innerText = `We'll keep checking every 5 seconds.  This can take a while for large orgs. Attempts: ${attemptCounter}`;
                           return;
                         }
                         
                         if (doneValue == 'true') {
                            clearInterval(intervalId);
                            var zipFileString = resultNode.getElementsByTagName('zipFile')[0].innerHTML;
                            chrome.runtime.sendMessage (
                              {action: $Techdicer.MESSAGES.UNZIP,
                              session: session,
                              zipfile: zipFileString}, 
                              function(unzipped) { 
                                  //console.log(unzipped);
                                  var fls = {};
                                  for(longFilename in unzipped){
                                      var folder = longFilename.split('/')[0];
                                      var profileName = longFilename.split('/')[1];
                                      if (folder === 'profiles') {
                                        /*  This is what the data look like....
                                        <fieldPermissions>
                                          <editable>true</editable>
                                          <field>Account.AccountSource</field>
                                          <readable>true</readable>
                                        </fieldPermissions>
                                        */
                                        
                                        // I'm take the data and adding a property to the fls object... one property 
                                        // for every Object.Field we find.   This gathers up all of the data from the files
                                        // into one place.    The value is another object thas has all the profile names as properties. 
                                        // Like this:  
                                        //    'Account.Custom_Field__c'
                                        //         'Admin.Profile'
                                        //              'editable' = 'true'
                                        //              'readable' = 'true'
                                        //         'SomeCustom.Profile'
                                        //              'editable = 'true'
                                        //              'readable = 'true'
                                        //    'Account.Website'
                                        //         'Admin.Profile'
                                        //              'editable = 'true'
                                        //              'readable = 'true'
                                        //         'SomeCustome.Profile'
                                        //              'editable = 'true'
                                        //              'readable = 'true'
                                              
                                        var profileXml = domParser.parseFromString(unzipped[longFilename], "text/xml");
                                        var fieldPermissions = profileXml.getElementsByTagName('fieldPermissions');
                                        for (fieldPermission of fieldPermissions) {
                                          
                                          fieldPermissionFieldName = fieldPermission.getElementsByTagName('field')[0].innerHTML;
                                          if (!fls[fieldPermissionFieldName]){
                                            fls[fieldPermissionFieldName] = {};
                                          }
                                          if (!fls[fieldPermissionFieldName][profileName]) {
                                            fls[fieldPermissionFieldName][profileName] = {};
                                          }
                                          fls[fieldPermissionFieldName][profileName]['editable'] =  fieldPermission.getElementsByTagName('editable')[0].innerHTML;
                                          fls[fieldPermissionFieldName][profileName]['readable'] =  fieldPermission.getElementsByTagName('readable')[0].innerHTML;
                                                                                  
                                        }

                                      }
                                  }

                            
                                  var firstFieldNameObject= Object.entries(fls)[0][1];
                                  var profileNames = Object.keys(firstFieldNameObject);
                                  var headerTds = profileNames.map(n => {
                                      return `<td>${n}</td>`;
                                  }).join('');
                            

                                  var tableHtml = `<table border='1'>
                                                    <tr><td>Object.Field</td>${headerTds}</tr>
                                                    ${Object.entries(fls).map(([key, value]) => {
                                                      return `<tr><td>${key}</td>
                                                        ${ Object.entries(value).map(([profileKey, profileValue]) => {

                                                          if (profileValue.editable == 'true') {
                                                            return '<td>Edit</td>'
                                                          } else if (profileValue.readable == 'true') {
                                                            return '<td>View</td>'                                
                                                          } else {
                                                            return '<td>Hidden</td>' 
                                                          }
                                                        }).join('') }

                                                    </tr>`}).join('')}
                                                  </table>`;
                                  modalcontent.innerHTML = tableHtml;
                    
                                }
                          );
                         
                         }
                      });
 
                     }, 5000, metadataRetrieveJobId);
               }
            );

          });
        });
      });
    }

    var closeButton = document.querySelector('#techdicerext-modal-close-button');
    closeButton.addEventListener('click', function(e){
      e.stopPropagation(); // block the container from getting this click event too.
      var modal = document.querySelector('.techdicerext-modall');
      modal.classList.remove('slds-show');
      modal.classList.add('slds-hide');
    })

  }
}


// this onMessage handler is an example of how to pass info from the Salsforce page
// into the background process.   Some and use sendMessage and it is received here.
// in most cases you probably don't need to use this but it's handy to know how to do it.
chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  console.log(message);
  if(message.action === window.$Techdicer.MESSAGES.GET_SESSION){
      // The org id is in a cookie called sid.  
      // We get that cookie for the tab url we are on.

      // This is what the sesssion object looks like that is passed back. 
      /*
      domain: "ejb-youtube.my.salesforce.com"
      domainAPI: "ejb-youtube.my.salesforce.com"
      isActive: false
      isMaster: true
      oid: "-- ORG ID ---"
      server: "ejb-youtube"
      sid: "----SESSION ID------"
      */

    chrome.cookies.getAll(
      {
        name: "sid",
        url: sender.tab.url
      }, 
      function (cookies){
        if(!cookies || !cookies.length || !cookies[0].value) return false;

        var organizationId  = cookies[0].value.split('!')[0];

        //gets all available session cookies and returns the
        //one associated with the current org id
        window.$Techdicer.getAllSessionCookies(function(sessions){
          callback(sessions[organizationId] || {});
        });
      }
    );
    return true; // async return

  } else if(message.action === window.$Techdicer.MESSAGES.METADATA_RETRIEVE) {
    // Doing the soap calls in the background to avoid cors issues.
    window.$Techdicer.startMetadataRetrieve(message.session.domainAPI, message.session.sid, message.metaTypes, function(data){
      callback(data);
    });
    return true; // async return

  } else if(message.action === window.$Techdicer.MESSAGES.METADATA_CHECKRETRIEVESTATUS) {
    // Doing the soap calls in the background to avoid cors issues.
    window.$Techdicer.checkRetrieveStatus(message.session.domainAPI, message.session.sid, message.asyncProcessId, 'true', function(data){
       callback(data);
    });
    return true; // async return
  } else if(message.action === window.$Techdicer.MESSAGES.UNZIP) {
    // I'm doing this in the background instead of on the page because I need to use this
    // JSZip library.  If I were to inject it into saleesforce page then I wouldn't need
    // to send a message, but I don't feel good about loading all sorts of things into the
    // page that aren't really needed.   The big downside is that we're passing both the 
    // zip base64 string and the unzipped content back and forth which eats up a lot of memory. 
    window.JSZip.loadAsync(message.zipfile, {"base64": true})
    .then(function(zip) {
      // Each file will end up being a property on this object and the value the context of the file.
      var unzipped = {};

      var promises = [];
 
      // Looping through each of the files and putting out the data.
      // Very bad idea if there is a lot of data.
      for(filename in zip.files){
        const thisFilename = filename;
        console.log(filename);
        var thisPromise = zip.file(thisFilename).async("string").then(function(data){
          unzipped[thisFilename] = data;
        });
        promises.push(thisPromise);          
      }

      // After all the asyncs are finished send the unzipped object to the callback.
      Promise.allSettled(promises).then(function(results){
        callback(unzipped);
      });
      
    });
    
    return true;

  } else {
    return false; // non-async return

  } 
});