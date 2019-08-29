// Add checkbox and class to all of the links which look like routes...
$(document).ready(function() {

  /**
   * Handler for the checkboxes. Saves tick to chrome storage and adds 
   * a class so it can be visually detected.
   */
  $(document).on("click",".ticked",function() {

    var pid =$(this).data("pid");
    console.log("check");
    var saved = (new Date).getTime();
    var key = "p"+pid;
    var obj = {};
    obj[key] = saved;

    var self = $(this);
    if (self.is(":checked")) {
      chrome.storage.sync.set(obj, function(foo) {
        //console.log('Value is set to ' + saved + " for key "+key);
        self.parents(".vsr").addClass("done");
        self.parent().addClass("done");
      });
    } else {
      console.log("uncheck");

      chrome.storage.sync.remove([key], function(foo) {
        self.parents(".vsr").removeClass("done");
      });

    }
  });

  var total = $(".vsr").length;
  var done = $(".done").length;
  var per = Math.round((done/total) * 100 * 100)/100;
  if (total > 0) {
    $("h3").append("<h2>"+per+"% "+done+"  out of "+total + " problem(s) done</h2>");
  }


  // Go through a problem page and add markers if the problem is already ticked
  var url = window.location.toString()
  var m = url.match(/(\d+).html/);
  if (m.length > 1) {
    var pid = m[1];
    addCheckbox(pid,$("h3"));
    // pid found, check if it's ticked..
    chrome.storage.sync.get(["p"+pid], function(result) {
      if (result["p"+pid]!=null) {
        $("h3").addClass("done");
        var d = new Date(result["p"+pid]);
        var datestring = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." +
          d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        $("h3").parent().append("<h4 style='color : red;'>Ticked at " +datestring+"</h4>");
      }
    });
  }

});

/**
 * Adds checkbox in front of given element t
 */
var addCheckbox = function(pid,t) {
    var checkbox = $('<input data-pid='+pid+' type="checkbox" name="ticked['+pid+']" class="ticked" value="1" />');
    // Find info from storage if this is already checked..
    if (pid != undefined) {
      chrome.storage.sync.get(["p"+pid], function(result) {
        if (result["p"+pid]!=null) {
          console.log('Value currently is ' + result["p"+pid]);
          checkbox.attr("checked","checked");
          t.parents(".vsr").addClass("done");
          t.parent().addClass("done");
        }
      });
    }
    t.prepend(checkbox);

}
// Go through the sector listing routes, add the checkboxes and add the done-class if the problem is ticked
$(".vsr").find("a").each(function() {
  var t= $(this);
  var m = t.attr("href").match(/(\d+).html/);
  if (m.length > 1) {
    var pid = m[1];
    addCheckbox(pid,t);
  }
});

