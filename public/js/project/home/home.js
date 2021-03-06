var list;

$('#save-or-cancel').hide()

$(document).ready(function(){

    $("ol.sortable").sortable({
        stop: function( event, ui ) {
            $('#save-or-cancel').show()
        },
        tolerance: "pointer",
        distance: 20
    });



    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        cache    : false,
        dataType : "json",
        async    : true,
        crossDomain: true,
        method : "GET",
        headers: {
            'login': $.cookie('username'),
            'password': $.cookie('password'),
        },
        error    : function(request, error) { // Info Debuggage si erreur         
                        alert("Erreur : responseText: "+request);  
                    },
        success  : function(data) {

                        setTimeout( // L'utilisation de cette méthode permet simplement de simuler de la latence pour voir l'écran de chargement
                            function(){
                                $('#row').html('')
                                list = data;
                                getHtmlList(data);
                                $('#row').removeClass('justify-content-center');

                                // Couleur en fonction du choix utilisateur
                                if ($.cookie("color") != 'danger') {
                                    $(`#row .btn-danger`).addClass(`btn-${$.cookie("color")}`);
                                    $(`#row .btn-danger`).removeClass(`btn-danger`);
                                    $(`#row .modal-danger`).addClass(`modal-${$.cookie("color")}`);
                                    $(`#row .modal-danger`).removeClass(`modal-danger`);    
                                    $(`#row .text-danger`).addClass(`text-${$.cookie("color")}`);
                                    $(`#row .text-danger`).removeClass(`text-danger`); 
                                  }                                
                            },
                            1000
                        )

                    }
    });
  

})

$(document).on('click', '.add-child-text', function(e){
    $('.add-child-text').removeClass('d-none')
    $('.add-child').addClass('d-none')
    e.stopPropagation()

    $(this).prev().removeClass('d-none')
    $(this).addClass('d-none')
})

$(document).on('click', '.add-child', function(e){
    e.stopPropagation()
})

$(document).on('click', 'body', function(e){
    $('.add-child-text').removeClass('d-none')
    $('.add-child').addClass('d-none')
})

$(document).on('submit', '#save', function(e){

    e.preventDefault();

    var new_list = {
        utilisateur: list.utilisateur,
        password:  list.password,
        todoListes: []
    }

    var this2;
    $('#row li').each(function(i){
        new_list.todoListes[i] = {
            name: list.todoListes[$(this).attr('parent')].name,
            elements: []
        }

        this2 = this;

        $(this).find(`.child-sortable`).children().each(function(i2){
            new_list.todoListes[i].elements[i2] = list.todoListes[$(this).attr('parent')].elements[$(this).attr('child')]
        }) 
    })


    list = new_list;

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(request, error) {        
            alert("Une erreur est survenue, les changements n'ont probablement pas été pris en compte. Veuillez actualiser la page.");  
        },
        success: function (data) {
            $('#save-or-cancel').hide()
        },
        data: JSON.stringify(new_list)
    });
})

$(document).on('submit', '.modify-parent', function(e){
    e.preventDefault();

    
    var i = $(this).attr('parent');

    list.todoListes[i].name = $(`#modal-input-parent${i}`).val()

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
        },
        data: JSON.stringify(list)
    });


    window.location.reload()
    $('#row').html('');
    getHtmlList(list)

});  

$(document).on('submit', '.modify-child', function(e){
    e.preventDefault();

    
    var i = $(this).attr('parent');
    var i2 = $(this).attr('child');

    list.todoListes[i].elements[i2] = $(`#modal-input-child${i}-${i2}`).val()

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(request, error) {        
            alert("Une erreur est survenue, les changements n'ont probablement pas été pris en compte. Veuillez actualiser la page.");  
        },
        data: JSON.stringify(list)
    });


    window.location.reload()
    $('#row').html('');
    getHtmlList(list)

});

$(document).on('click', '.delete-child', function(){
    deleteElement($(this).attr('parent'), $(this).attr('child'))
});  

$(document).on('click', '.delete-parent', function(){
    deleteElement($(this).attr('parent'), null)
});  

$(document).on('submit', '.add-child', function(e){
    e.preventDefault();
    
    elements = list.todoListes[$(this).children().attr('parent')].elements

    for (var i = 0; i < elements.length; i++) {
        last_i = i
    }

    if(last_i == null) {
        var last_i = 0;
    }
    
    list.todoListes[$(this).children().attr('parent')].elements[last_i + 1] = $(this).children().val() 

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(request, error) {        
            alert("Une erreur est survenue, les changements n'ont probablement pas été pris en compte. Veuillez actualiser la page.");  
        },
        data: JSON.stringify(list)
    });

    $('#row').html('');
    getHtmlList(list)

}); 

$(document).on('submit', '.add-parent', function(e){
    e.preventDefault();
    
    elements = list.todoListes

    var i = 0;
    for (var i = 0; i < elements.length; i++) {
        last_i = i
    }

    if(last_i == null){
        var last_i = 0;
    }
    
    list.todoListes[last_i + 1] = {
        name: $(this).children().val(),
        elements: [],
    } 

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(request, error) {        
            alert("Une erreur est survenue, les changements n'ont probablement pas été pris en compte. Veuillez actualiser la page.");  
        },
        data: JSON.stringify(list)
    });

    $('#row').html('');
    getHtmlList(list)

}); 

let deleteElement = function (parent, child) {

    if(child != null) {
        delete list.todoListes[parent].elements[child];
    } else {
        delete list.todoListes[parent]
    }

    $.ajax({
        url      : "http://92.222.69.104/todo/listes/",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(request, error) {        
            alert("Une erreur est survenue, les changements n'ont probablement pas été pris en compte. Veuillez actualiser la page.");  
        },
        data: JSON.stringify(list)
    });

    $('#row').html('');
    getHtmlList(list)
}

let getHtmlList = function (data) {

    $.each(data.todoListes, function(i, obj){

        if (obj != null) {
            $('#row').append(`     

            <li class="col-md-4  mb-4" parent="${i}">

            <div class="modal fade" id="modal${i}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-notify modal-danger" style="color: white;" role="document">
              <div class="modal-content">
                <div class="modal-header text-center">
                  <h4 class="modal-title w-100 font-weight-bold">Modifier un parent</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form class="modify-parent" parent="${i}">
                    <div class="modal-body mx-3">
          
                      <div class="md-form mb-4">
                        <input type="text" id="modal-input-parent${i}" class="form-control validate" value="${obj.name}">
                      </div>
          
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                      <button class="btn btn-danger" type="submit">Modifier</button>
                    </div>	  
                </form>
              </div>
            </div>
          </div> 

            <!-- Card -->
            <div class="card hoverable">
            
            <!-- Card content -->
            <div class="card-body">

                <h5 class="dark-grey-text my-4 note note-light">${obj.name}
                    <div parent="${i}" class="delete-parent pointer float-right">
                        <i class="fas fa-eraser"></i>
                    </div> 
                    <div class="pointer float-right" data-toggle="modal" data-target="#modal${i}">
                        <i class="fas fa-pencil-alt"></i>
                    </div>    
                </h5>
                <br/>
                <div id="${i}-todo" class="child-sortable" style="min-height: 50px;">
                </div>

                <form class="add-child d-none">
                    <input type="text" parent="${i}" class="form-control" placeholder="Ajouter un élément">
                </form>
                <div class="add-child-text m-t-3 pointer"><i class="fas fa-plus-circle text-danger" style="font-family: "Roboto", sans-serif;"> Ajouter une tâche</i></div>

            </div>

            </div>
            <!-- Card -->

            </li>
            
          `)

            let elements = Array.from(obj.elements)
            let itemsSortable = ''
            
            for (var i2 = 0; i2 < elements.length; i2++) {

                if(elements[i2] != null) {
                    $(`#${i}-todo`).append(` 
                    <div class="inline child-sortable-${i}" id="${i}-${i2}" parent="${i}" child="${i2}">${elements[i2]} 
                        <div parent="${i}" child="${i2}" class="delete-child pointer float-right">
                            <i class="fas fa-eraser "></i>
                        </div> 
                        <div class="pointer float-right" data-toggle="modal" data-target="#modal${i}-${i2}  ">
                            <i class="fas fa-pencil-alt "></i>
                        </div>  
                        <div class="modal fade" id="modal${i}-${i2}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-notify modal-danger" style="color: white;" role="document">
                          <div class="modal-content">
                            <div class="modal-header text-center">
                              <h4 class="modal-title w-100 font-weight-bold">Modifier un parent</h4>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <form class="modify-child" parent="${i}" child="${i2}">
                                <div class="modal-body mx-3">
                      
                                  <div class="md-form mb-4">
                                    <input type="text" id="modal-input-child${i}-${i2}" class="form-control validate" value="${elements[i2]}">
                                  </div>
                      
                                </div>
                                <div class="modal-footer d-flex justify-content-center">
                                  <button class="btn btn-danger" type="submit">Modifier</button>
                                </div>	  
                            </form>
                          </div>
                        </div>
                      </div>
                      <hr/>                         
                    </div>
                    
                    `)
                }

            }

            $( `#${i}-todo` ).sortable({
                stop: function( event, ui ) {
                    $('#save-or-cancel').show()
                },
                connectWith: ".child-sortable"
            });
        }

    });

}

