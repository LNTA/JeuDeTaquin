/*//
    Écrit par: Linda Nzumotcha
//*/
$(document).ready (function () {
    
 $(".affichage").css({
        "display": "inline-block"
});

$("#compte").css({
    "font-style": "italic",
    "font-size": "20px"
});
    
 //initialisation des parametres   
    var params = {
        nbRows: $("#nbRows").val(3),
        nbCols: $("#nbCols").val(3),
        checkBox: 1,
        hidePart: "br",
        mixing: 200,
        urlimage: $("#urlImage").val("https://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"),
        success: "complete"
    };
   
   //alert(params);
   function getparamsInitiaux(){
       parametresIni = {
            nbRows: $("#nbRows").val(),
            nbCols: $("#nbCols").val(),
            checkBox: $("#numeros:checkbox:checked").length,
            hidePart: "br",
            mixing: 200,
            urlimage: $("#urlImage").val(),
            success: "complete"
        };
        
        return parametresIni;
   }
   
    var parametresInitiaux = getparamsInitiaux();
    
    var overlay = $("#overlay");
    var clickFunction,
    gameStart,
    gameState,
    squareWidth,
    squareHeight;
    var generate, nbdeplacement=0;
    
    //  les états de jeu
    function initialiseGameVar(nbCols, nbRows, hidePart) {
       // alert("dans initialiseGameVar!");
        
        var game =[],
        gameRow,
        gameDiv,
        xi = 0,
        yi = 0,
        currentDisplay;
        
        for (xi = 0; xi < nbCols; xi += 1) {
            gameRow =[];
            for (yi = 0; yi < nbRows; yi += 1) {
                gameDiv =[];
                
                currentDisplay = true;
                if ((xi === (nbCols - 1)) && (yi === (nbRows - 1)) && (hidePart === "br")) {
                    currentDisplay = false;
                }
                
                gameDiv[0] = currentDisplay;
                gameDiv[1] = "taquin-" + xi + "-" + yi;
                gameRow[yi] = gameDiv;
            }
            game[xi] = gameRow;
        }
        
        return game;
    }
    
    // Repérons la case dans le jeu.
    function getId(taquin) {
        var classList = taquin.attr("class").split(/\s+/),
        result = "";
        
        $.each(classList, function (index, item) {
            if (index === 0) {
                result = item;
            }
        });
        
        return result;
    }
    
    function getCoord(id) {
        var coord =[],
        xi = 0,
        yi = 0;
        
        for (xi = 0; xi < gameStart.length; xi += 1) {
            for (yi = 0; yi < gameStart[0].length; yi += 1) {
                if (gameState[xi][yi][1] === id) {
                    coord[0] = xi;
                    coord[1] = yi;
                }
            }
        }
        
        return coord;
    }
    
    // Repérons quel est l'élément vide.
    function getEmpty() {
        var empty =[],
        xi = 0,
        yi = 0;
        
        for (xi = 0; xi < gameStart.length; xi += 1) {
            for (yi = 0; yi < gameStart[0].length; yi += 1) {
                if (gameState[xi][yi][0] === false) {
                    empty[0] = xi;
                    empty[1] = yi;
                    empty[2] = gameState[xi][yi][1];
                }
            }
        }
        
        return empty;
    }
    
    // vérifions si un élément peut être bougé.
    function getIsMovable(x, y) {
        var isMovable = false;
        
        try {
            if (gameState[x][y - 1][0] === false) {
                isMovable = true;
            }
        }
        catch (err1) {
        }
        try {
            if (gameState[x + 1][y][0] === false) {
                isMovable = true;
            }
        }
        catch (err2) {
        }
        try {
            if (gameState[x][y + 1][0] === false) {
                isMovable = true;
            }
        }
        catch (err3) {
        }
        try {
            if (gameState[x - 1][y][0] === false) {
                isMovable = true;
            }
        }
        catch (err4) {
        }
        
        return isMovable;
    }
    
    
    
    // Mélangeons les pièces.
    function randomGame(mixing) {
        var empty,
        possibleMove,
        temp,
        i = 0,
        j = 0,
        xi = 0,
        yi = 0,
        xj = 0,
        yj = 0,
        rand = 0,
        newPosTop = 0,
        newPosLeft = 0;
        
        for (j = 0; j < mixing; j += 1) {
            empty = getEmpty();
            possibleMove =[];
            i = 0;
            
            // On cherche les voisins déplaçables.
            try { if (gameState[empty[0]][empty[1] - 1][0] === true) {
                    possibleMove[i] =[];
                    possibleMove[i][0] = empty[0];
                    possibleMove[i][1] = empty[1] - 1;
                    i += 1;
                }
            }
            catch (err1) {
            }
            try { if (gameState[empty[0] + 1][empty[1]][0] === true) {
                    possibleMove[i] =[];
                    possibleMove[i][0] = empty[0] + 1;
                    possibleMove[i][1] = empty[1];
                    i += 1;
                }
            }
            catch (err2) {
            }
            try { if (gameState[empty[0]][empty[1] + 1][0] === true) {
                    possibleMove[i] =[];
                    possibleMove[i][0] = empty[0];
                    possibleMove[i][1] = empty[1] + 1;
                    i += 1;
                }
            }
            catch (err3) {
            }
            try { if (gameState[empty[0] - 1][empty[1]][0] === true) {
                    possibleMove[i] =[];
                    possibleMove[i][0] = empty[0] - 1;
                    possibleMove[i][1] = empty[1];
                    i += 1;
                }
            }
            catch (err4) {
            }
            
            // On choisit au hasard le voisin à interchanger.
            rand = Math.floor(Math.random() * possibleMove.length);
            
            // et On l'interchange dans l'état de jeu.
            temp = gameState[empty[0]][empty[1]];
            gameState[empty[0]][empty[1]] = gameState[possibleMove[rand][0]][possibleMove[rand][1]];
            gameState[possibleMove[rand][0]][possibleMove[rand][1]] = temp;
        }
        
        // On trouve les déplacements pour l'animation.
        
        for (xi = 0; xi < gameStart.length; xi += 1) {
            for (yi = 0; yi < gameStart[0].length; yi += 1) {
                // On cherche sa nouvelle position
                for (xj = 0; xj < gameState.length; xj += 1) {
                    for (yj = 0; yj < gameState[0].length; yj += 1) {
                        // On trouve la nouvelle position.
                        if (gameStart[xi][yi][1] === gameState[xj][yj][1]) {
                            // On récupère les coordonnées de la nouvelle position.
                            if (gameStart[xi][yi][0] === true) {
                                newPosTop = parseInt((squareHeight * yj) - $(".taquin-" + xi + "-" + yi).position().top, 10) + "px";
                                newPosLeft = parseInt((squareWidth * xj) - $(".taquin-" + xi + "-" + yi).position().left, 10) + "px";
                                
                                $(".taquin-" + xi + "-" + yi).animate({
                                    top: "+=" + newPosTop,
                                    left: "+=" + newPosLeft
                                });
                            } else {
                                $(".taquin-" + xi + "-" + yi).css({
                                    "top": (squareHeight * yj),
                                    "left": (squareWidth * xj)
                                });
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Démarrage du jeu
    function launcher(generatevar) {
        // On enlève l'intialisation de jeu.
        generatevar.find(".taquin-part").off("click");
        
        // On cherche l'élément vide.
        var empty = getEmpty();
        
        $("." + empty[2]).animate({
            opacity: "0.1"
        },
        function () {
            // On le cache.
            $(this).hide();
            
            // On mélange le jeu.
            randomGame(params.mixing);
            
            // Annules toutes les animations s'il y en a de pas finie.
            generatevar.find(".taquin-part").clearQueue();
            
            // Permettre le déplacement des pièces, jeu jouable !
            generatevar.find(".taquin-part").on("click", function () {
                clickFunction(generatevar, $(this));
            });
        });
    }
    
    
    
    // Quand on clique sur une partie après le lancement du jeu.
    clickFunction = function (generatevariable, source) {
        // rempli ici mais défini plus haut car appelé dans la fonction d'au dessus.
        var empty,
        moveTop = 0,
        moveLeft = 0,
        tempTop = 0,
        tempLeft = 0,
        temp,
        
        // Identifier l'élément.
        id = getId(source),
        
        // Trouver sa position dans le jeu.
        coord = getCoord(id),
        
        // Vérifier si il est déplaçable.
        isMovable = getIsMovable(coord[0], coord[1]);
        nbdeplacement+=1;
        // Si il est déplaçable, interchanger les positions.
        if (isMovable) {
            // Trouver l'élément vide.
            empty = getEmpty();
            
            // On trouve les déplacements pour l'animation.
            generatevariable.find("." + empty[2]).show();
            moveTop = generatevariable.find("." + id).position().top - generatevariable.find("." + empty[2]).position().top;
            moveLeft = generatevariable.find("." + id).position().left - generatevariable.find("." + empty[2]).position().left;
            generatevariable.find("." + empty[2]).hide();
            
            //On met les variable en temporaire pour l'interchangement.
            tempTop = source.position().top;
            tempLeft = source.position().left;
            
            // On inverse les positions de l'éléments vide.
            temp = gameState[coord[0]][coord[1]];
            gameState[coord[0]][coord[1]] = gameState[empty[0]][empty[1]];
            gameState[empty[0]][empty[1]] = temp;
            
            // On anime le changement.
            source.off("click").animate({
                top: "-=" + moveTop,
                left: "-=" + moveLeft
            },
            function () {
                $("#compte").html(nbdeplacement); 
                source.on("click", function () {
                    clickFunction(generatevariable, source);
                });
                
                // Si l'état initial après animation est le même que l'état actuel, on a fini le jeu.
                if (gameState.toString() === gameStart.toString()) {
                    // On enlève les fonctions de déplacement.
                    generatevariable.find(".taquin-part").off("click");
                    
                    // On cherche l'élément vide pour le ré-afficher.
                    var empty = getEmpty();
                    $("." + empty[2]).show().animate({
                        opacity: "1"
                    },
                    function () {
                        // On replace le mécanisme de démarrage du jeu.
                        generatevariable.find(".taquin-part").on("click", function () {
                            launcher(generatevariable);
                        });
                        // On exécute la fonction de réussite.
                        //alert(params.success);
                        alert(params.success+".Vous avez complété le jeu avec "+ nbdeplacement+ " de déplacements!")
                        nbdeplacement = 0;
                    });
                }
            });
            
            generatevariable.find("." + empty[2]).css({
                "top": tempTop + "px",
                "left": tempLeft + "px"
            });
        }
    };
    
    // Fonction exécutée sur chaque élément sélectionné comme model pour devenir un taquin.
    function taquin(generatevariablei, parametres, imageOriginalSize) {
        var xi = 0,
        yi = 0, number = 0,
        backgroundSizeString;
        
        // Récupère la largeur et hauteur des partis du taquin.
        squareWidth = Math.round(imageOriginalSize[0] / parametres.nbCols);
        squareHeight = Math.round(imageOriginalSize[1] / parametres.nbRows);
        
        // Initialise l'état initial et actuelle du jeu.
        gameStart = initialiseGameVar(parametres.nbCols, parametres.nbRows, parametres.hidePart);
        
        gameState = initialiseGameVar(parametres.nbCols, parametres.nbRows, parametres.hidePart);
        
        generatevariablei.css({
            "position": "relative",
            "width": imageOriginalSize[0] + "px",
            "height": imageOriginalSize[1] + "px",
            "border": "3px solid white"
        });
        
        // Générer les partis du taquin.
        for (xi = 0; xi < gameStart.length; xi += 1) {
            for (yi = 0; yi < gameStart[0].length; yi += 1) {
                backgroundSizeString = imageOriginalSize[0] + "px " + imageOriginalSize[1] + "px";
                
                var divInterne = $("<div>").addClass(gameStart[xi][yi][1]).addClass("taquin-part");
                //alert("dans taquin! divInterne className: " + divInterne.attr('class'));
                divInterne.css({
                        "cursor": "pointer",
                        "background-image": "url('" + parametres.urlimage + "')",
                        "background-position": "-" + parseInt(squareWidth * xi, 10) + "px -" + parseInt(squareHeight * yi, 10) + "px",
                        "background-size": backgroundSizeString,
                        "position": "absolute",
                        "top": parseInt(squareHeight * yi, 10) + "px",
                        "left": parseInt(squareWidth * xi, 10) + "px",
                        "width": squareWidth + "px",
                        "height": squareHeight + "px",
                        "border": "1px solid black"
                    });
                    
                    if (parametres.checkBox > 0){
                        divInterne.html(number); number+=1;
                        }
                        
                    if (gameState[xi][yi][0] === false) {
                        divInterne.css("opacity", "0.1");
                    }
                 
                 generatevariablei.append(divInterne);
            }
        }
        
    }
    
    
    function gameTaquin(imageurl, parametres, success) {
        
        // Si la division est inférieur à 2, la valeur est 2.
        if (parametres.nbRows < 2) {
            parametres.nbRows = 2;
        }
        if (parametres.nbCols < 2) {
            parametres.nbCols = 2;
        }
            
            // Information sur l'image.
            var waitForImageSize,
            forImage = new Image(),
            imageSize =[];
            
            forImage.src = imageurl;
            //alert("gameTaquin: " + forImage.width);
            // Quand on obtient une taille pour l'image, on execute le mécanisme.
            
            if (forImage.width !== 0) {
            imageSize[0] = forImage.width;
            imageSize[1] = forImage.height;
            
            // Génère l'élément qui contiendra les partis du taquin.
            generate = $("<div>").addClass("taquin-generate");
            if (overlay.next().hasClass("taquin-generate")) {
            overlay.next().remove();
            }
            //alert('imagesize=' + imageSize[0] + imageSize[1]);
            overlay.after(generate);
            
            //alert('done!');
            
            taquin(generate, parametres, imageSize);
            }
            
    };
    
    gameTaquin(parametresInitiaux.urlimage, parametresInitiaux, parametresInitiaux.success);
    $("#compte").html(nbdeplacement);
    
    $('#afficher').on("click", function () {
        
        params = {
            nbRows: $("#nbRows").val(),
            nbCols: $("#nbCols").val(),
            checkBox: $("#numeros:checkbox:checked").length,
            hidePart: "br",
            mixing: 200,
            urlimage: $("#urlImage").val(),
            success: "complete"
        };
        
        gameTaquin(params.urlimage, params, params.success);
        $("#compte").html(nbdeplacement);
    });
    
    $('#brasser').on("click", function () {
        
        params = {
            nbRows: $("#nbRows").val(),
            nbCols: $("#nbCols").val(),
            checkBox: $("#numeros:checkbox:checked").length,
            hidePart: "br",
            mixing: 200,
            urlimage: $("#urlImage").val(),
            success: "complete"
        };
        // On mélange le jeu.
            randomGame(params.mixing);
        // Permettre de démarrer le jeu.
        generate.find(".taquin-part").on("click", function () {
            launcher(generate);
        });
    });
    
});
