console.log("Power VSTS Extension is active");

var StoryPointsColumnIndex = -1;
var StoryPointColumnName = "Story Points";
var SprintWorkingDaysDiv = null;
var ProductBacklogTable = null;
var SprintWorkingDaysDivDefaultValue = "";

function checkPage() {

    ProductBacklogTable = document.getElementsByClassName('productbacklog-grid-results')[0];
    if (ProductBacklogTable) {
        var backlogHeader = ProductBacklogTable.getElementsByClassName('grid-header-canvas')[0];
        if (backlogHeader) {
            var columns = backlogHeader.getElementsByClassName('grid-header-column');
            StoryPointsColumnIndex = -1;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].getAttribute('aria-label') == StoryPointColumnName) {
                    StoryPointsColumnIndex = i;
                    break;
                }
            }
            if (StoryPointsColumnIndex != -1) {
                SprintWorkingDaysDiv = document.getElementsByClassName('sprint-working-days')[0];

                if (SprintWorkingDaysDiv) {
                    SprintWorkingDaysDivDefaultValue = SprintWorkingDaysDiv.innerText;
                    return true;
                }
            }
        }
    }
    return false;
}

function setStoryPoints(backLogTable, columnIndex, outputDiv) {
    var storyPoints = 0;
    var rows = backLogTable.getElementsByClassName('grid-row grid-row-normal');
    for (var i=0;i<rows.length;i++) {
        var spColumn = rows[i].getElementsByClassName('grid-cell')[columnIndex];
        if (spColumn) {
            var val = Number(spColumn.innerText);
            storyPoints += val;
        }
    }
    outputDiv.innerText = SprintWorkingDaysDivDefaultValue + " (" + storyPoints + " story points)";
}

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

// Observe a specific DOM element:


setTimeout(
    function () {
        if (checkPage()) {
            observeDOM( document.getElementsByClassName('grid-row grid-row-normal')[0] ,function(){ 
                setStoryPoints(ProductBacklogTable, StoryPointsColumnIndex, SprintWorkingDaysDiv);
            });
            console.log('Backlog detected');
            
        } else {
            console.log('Backlog is not detected');
        }
    },
    2000);


    var objs = []; // we'll store the object references in this array

    function walkTheObject( obj ) {
        var keys = Object.keys( obj ); // get all own property names of the object
    
        keys.forEach( function ( key ) {
            var value = obj[ key ]; // get property value
    
            // if the property value is an object...
            if ( value && typeof value === 'object' ) { 
    
                // if we don't have this reference...
                if ( objs.indexOf( value ) < 0 ) {
                    objs.push( value ); // store the reference
                    walkTheObject( value ); // traverse all its own properties
                } 
    
            }
        });
    }
    
    walkTheObject( this ); // start with the global object

    console.log(objs);