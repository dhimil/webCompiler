$("#compile").click(function(e) {
  var code = $("#code").val();
  if(code == "") {
    $(".formElement.panel").removeClass("panel-success").addClass("panel-danger");
  }
  $.ajax({
    type: "POST",
    url: "/compile",
    data: { code: code, lang: "cpp" }
  }).done(function( msg ) {
    console.log( "Compile result: " + msg );
    var compilationOutput = JSON.parse(msg);
    $("#lightbox div").text("");
    if(compilationOutput.exitStatus != 0) {
      $(".formElement.panel").removeClass("panel-success").addClass("panel-danger");
      $("#lightbox .stderr").text(compilationOutput.stderr);
      $("#lightbox .title").text("Error");
      $("#lightbox").addClass("border-error");
    } else {
      $(".formElement.panel").removeClass("panel-danger").addClass("panel-success");
      $("#lightbox .stdout").text(compilationOutput.stdout);
      $("#lightbox .title").text("Output");
      $("#lightbox").addClass("border-success");
    }
    $("#lightbox").removeClass("hidden");
    $(".mainForm").addClass("blur");
    $(".mainForm").click(function(e) {
      $(".mainForm").removeClass("blur");
      $("#lightbox").addClass("hidden");
      $(".mainForm").unbind('click');
    });
  });
});

$("#code").focus(function(e) {
  $(".formElement.panel").removeClass("panel-danger").addClass("panel-success");
});