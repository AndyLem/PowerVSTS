console.log("Power VSTS Extension is active");

var StoryPointsColumnIndex = -1;
var StoryPointColumnName = "Story Points";
var SprintWorkingDaysDiv = null;
var ProductBacklogTable = null;
var SprintWorkingDaysDivDefaultValue = "";
var StoryPointsSpan = null;
var WorkItems = {};

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
                    StoryPointsSpan = document.createElement("span", { id : 'storyPoints' });
                    SprintWorkingDaysDiv.appendChild(StoryPointsSpan);
                    return true;
                }
            }
        }
    }
    return false;
}

function collectWorkItems(backlogTable, columnIndex) {
    var rows = backlogTable.getElementsByClassName('grid-row grid-row-normal');
    for (var i=0;i<rows.length;i++) {
        var spColumn = rows[i].getElementsByClassName('grid-cell')[columnIndex];
        if (spColumn) {
            var val = Number(spColumn.innerText);
            if (val != 0)
                WorkItems[rows[i].getAttribute('id')] = val;
        }
    }

    
}

function setStoryPoints(outputDiv) {
    var storyPoints = 0;
    // var rows = backLogTable.getElementsByClassName('grid-row grid-row-normal');
    // for (var i=0;i<rows.length;i++) {
    //     var spColumn = rows[i].getElementsByClassName('grid-cell')[columnIndex];
    //     if (spColumn) {
    //         var val = Number(spColumn.innerText);
    //         storyPoints += val;
    //     }
    // }
    for (var key in WorkItems) {
        storyPoints += WorkItems[key];
    }

    console.log('storypoints calculated: ' + storyPoints);

    outputDiv.innerText = " (" + storyPoints + " story points)";
    outputDiv.setAttribute('title', 'Scroll the backlog to refresh this value');
}

function checkOutputSpanExistence(parentElement) {
    if (!StoryPointsSpan.parentElement)
        parentElement.appendChild(StoryPointsSpan);
}

function update() {
    collectWorkItems(ProductBacklogTable, StoryPointsColumnIndex);
    checkOutputSpanExistence(SprintWorkingDaysDiv);
    setStoryPoints(StoryPointsSpan);
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

setTimeout(
    function () {
        if (checkPage()) {
            console.log('Backlog detected');
            update();

            observeDOM( document.getElementsByClassName('productbacklog-grid-results')[0],
            function(){ 
                console.log('Backlog has been changed. Updating storypoints')
                update();
            });

            // observeDOM(document.getElementsByClassName('sprint-dates-working-days')[0],
            // function(){ 
            //     console.log('Header has been changed. Updating storypoints')
            //     update();
            // });
            
        } else {
            console.log('Backlog is not detected');
        }
    },
    2000);   