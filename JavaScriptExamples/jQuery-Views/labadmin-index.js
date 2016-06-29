$( function() {

  /* Selectors */

    /* General */

    var $labNewButton                = $( 'a.new-lab' ),
        $createLabForm               = $( 'div.new-lab-form' ),
        $newLabName                  = $( 'input.new-lab-name' ),
        $submitNewLab                = $( 'button.submit-new-lab' ),
        $cancelNewLab                = $( 'button.cancel-new-lab' ),

        $instructionsButton          = $( 'a#labAdminInstructionsBtn' ),
        $companiesPictures           = $( '#companiesPicturesBtn' ),

    /* Labs */

        $lab                         = $( '.lab.row' ),
        $labRename                   = $( '.box-toolbar > li.mtslink > i.rename' ),
        $labAssociate                = $( '.box-toolbar > li.mtslink > i.associate' ),
        $labShareSettings            = $( '.box-toolbar > li.mtslink > i.share-settings' ),
        $labDelete                   = $( '.box-toolbar > li.mtslink > i.delete' ),

        $labMessages                 = $( '.user-message-container.lab-messages' ),
        $labRenameMessage            = $( '.user-message-container.lab-messages > .rename-message' ),
        $labDeleteMessage            = $( '.user-message-container.lab-messages > .delete-message' ),
        $labUserFeedBack             = $( '.user-message-container.lab-messages > .user-feedback'),

    /* Equipment */

        $equipment                   = $( '.box.equipment' ),

        $equipmentCardFront          = $( '.box.equipment .front' ),
        $equipmentCardBack           = $( '.box.equipment .back' ),

        $equipmentNew                = $( '.box-footer a.new-equipment' ),

        $equipmentSettings           = $( 'i.settings' ),
        $equipmentSettingsBack       = $( 'i.exit' ),

        $equipmentRename             = $( 'i.rename' ),
        $equipmentMove               = $( 'i.move' ),
        $equipmentDelete             = $( 'i.delete' ),
        $equipmentShareSettings      = $( 'i.share-settings' ),
        $equipmentTypeChange         = $( 'i.type-settings' ),
        $equipmentPictures           = $( 'i.equipment-pictures' ),

        $equipmentMessages           = $( '.user-message-container.equipment-messages' ),
        $equipmentNewMessage         = $( '.user-message-container.lab-messages > .new-equipment-message' ),
        $equipmentRenameMessage      = $( '.user-message-container.equipment-messages > .rename-message' ),
        $equipmentMoveMessage        = $( '.user-message-container.equipment-messages > .move-message' ),
        $equipmentDeleteMessage      = $( '.user-message-container.equipment-messages > .delete-message' ),
        $equipmentUserFeedBack       = $( '.user-message-container.equipment-messages > .user-feedback'),

    /* Modals */

        $labShareSettingsModal       = $( '#lab-share-modal' ),
        $labEquipmentAssociateModal  = $( '#equipment-associate-modal' ),
        $equipmentShareSettingsModal = $( '#equipment-share-modal' ),
        $equipmentTypeSelectorModal  = $( '#equipment-selector-modal' ),
        $companiesPicturesModal      = $( '#companies-pictures-modal' ),
        $equipPicturesModal          = $( '#equipment-pictures-modal' ),
        $equipCustomModal            = $( '#equipment-custom-modal' );


  /* General Methods */

    var displayUserInterface = function ( e ) {
      e.preventDefault();
      var dataset, delTargetClass, curTargetClass;
      if ( typeof e.delegateTarget.dataset === 'undefined' ) {
          dataset = $( e.delegateTarget ).data();
      } else {
          dataset = e.delegateTarget.dataset;
      }
      if ( typeof e.delegateTarget.classList === 'undefined' ) {
        delTargetClass = e.delegateTarget.className.split( ' ', 1 )[0];
        curTargetClass = e.currentTarget.className.split( ' ', 1 )[0];
      } else {
        delTargetClass = e.delegateTarget.classList[0];
        curTargetClass = e.currentTarget.classList[0];
      }

      switch ( delTargetClass ) {
        case 'lab':
          var $labMessageContainer = $( e.delegateTarget.children ).find( $labMessages.selector );
          $labMessageContainer
            .removeClass( 'hidden' );
          switch ( curTargetClass ) {
            case 'rename':
              $labMessageContainer
                .children( $labRenameMessage.selector )
                .removeClass( 'hidden' )
                .on( 'keydown', '.name', { dataset: dataset, target: e.delegateTarget }, postLabRename )
                .on( 'click', '.confirm-rename', { dataset: dataset, target: e.delegateTarget }, postLabRename )
                .on( 'click', '.cancel-rename',  { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface )
                .find( '.name' )
                .focus();
              break;
            case 'delete':
              $labMessageContainer
                .children( $labDeleteMessage.selector )
                .removeClass( 'hidden' )
                .on( 'click', '.confirm-delete', { dataset: dataset, target: e.delegateTarget }, postLabDelete )
                .on( 'click', '.cancel-delete', { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface );
              break;
            case 'new-equipment':
              var equipmentObj = {dataset: dataset, target: e.delegateTarget,
                                  originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass };
              $labMessageContainer
                .children( $equipmentNewMessage.selector )
                .removeClass( 'hidden' )
                .on( 'keydown', '.name', equipmentObj, postNewEquipment )
                .on( 'click', '.confirm-new-equipment', equipmentObj , postNewEquipment)
                .on( 'click', '.cancel-new-equipment',  { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface )
                .find( '.name' )
                .focus();
              break;
            default:
              break;
          }
          break;
        case 'equipment':
          var $equipmentMessageContainer = $( e.delegateTarget.children ).find( $equipmentMessages.selector );
          $equipmentMessageContainer
            .removeClass( 'hidden' );
          switch ( curTargetClass ) {
            case 'rename':
              $equipmentMessageContainer
                .children( $equipmentRenameMessage.selector )
                .removeClass( 'hidden' )
                .on( 'keydown', '.name', { dataset: dataset, target: e.delegateTarget }, postEquipmentRename )
                .on( 'click', '.confirm-rename', { dataset: dataset, target: e.delegateTarget }, postEquipmentRename )
                .on( 'click', '.cancel-rename', { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface )
                .find( '.name' )
                .focus();
              break;
            case 'move':
              $equipmentMessageContainer
                .children( $equipmentMoveMessage.selector )
                .removeClass( 'hidden' )
                .on( 'click', '.confirm-move',  { dataset: dataset, target: e.delegateTarget }, postEquipmentMoveLab )
                .on( 'click', '.cancel-move', { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface );
              break;
            case 'delete':
              $equipmentMessageContainer
                .children( $equipmentDeleteMessage.selector )
                .removeClass( 'hidden' )
                .on( 'click', '.confirm-delete', { dataset: dataset, target: e.delegateTarget }, postEquipmentDelete )
                .on( 'click', '.cancel-delete', { originalEvent: e, delTargetClass: delTargetClass, curTargetClass: curTargetClass }, hideUserInterface );
              break;
            default:
              break;
            }
          break;
        default:
          break;
        }
    };

    var hideUserInterface = function( e ) {

      switch( e.data.delTargetClass ) {
        case 'lab':
        var $labMessageContainer = $( e.data.originalEvent.delegateTarget.children ).find( $labMessages.selector );
        $labMessageContainer
          .fadeOut( 'fast', function() {
            $labMessageContainer
              .addClass( 'hidden' )
              .removeAttr( 'style' )
              .off();
          });
          switch( e.data.curTargetClass ) {
            case 'rename':
              $labMessageContainer
                .children( $labRenameMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            case 'delete':
              $labMessageContainer
                .children( $labDeleteMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            case 'new-equipment':
              $labMessageContainer
                .children( $equipmentNewMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            default:
              break;
          }

        break;
       case 'equipment':
        var $equipmentMessageContainer = $( e.data.originalEvent.delegateTarget.children ).find( $equipmentMessages.selector );
        $equipmentMessageContainer
          .fadeOut( 'fast', function() {
            $equipmentMessageContainer
              .addClass( 'hidden' )
              .removeAttr( 'style' )
              .off();
          });

          switch( e.data.curTargetClass ) {
            case 'rename':
              $equipmentMessageContainer
                .children( $equipmentRenameMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            case 'move':
              $equipmentMessageContainer
                .children( $equipmentMoveMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            case 'delete':
              $equipmentMessageContainer
                .children( $equipmentDeleteMessage.selector )
                .addClass( 'hidden' )
                .off();
              break;
            default:
              break;
         }

         break;
       default:
         break;
      }
      rebindListeners();
    };

    var messagesController = function( $element, duration, cb ) {
      $element
        .finish()
        .fadeOut( 'fast', function( e ) {
          $element
            .addClass( 'hidden' )
            .removeAttr( 'style' )
            .off();
          $element
            .children()
            .addClass( 'hidden' )
            .off();
          if ( typeof cb === 'function' ) { cb(); }
          rebindListeners();
        });
    };

    var userFeedbackController = function( $element, labelType, msg, duration, cb ) {
      $element
        .finish()
        .removeClass( 'hidden' )
        .html( '<span class="label label-' + labelType + '">' + msg + '</span>' )
        .fadeOut( duration, function() {
          $element
            .addClass( 'hidden' )
            .removeAttr( 'style' )
            .empty();
          if ( typeof cb === 'function' ) { cb(); }
          if ( labelType === 'success' ) { rebindListeners(); }
        });
    };

    var rebindListeners = function() {
      $( $lab.selector )
        .off()
        .on( 'click', $labRename.selector, displayUserInterface )
        .on( 'click', $labDelete.selector, displayUserInterface )
        .on( 'click', $equipmentNew.selector, displayUserInterface)
        .on( 'click', $labShareSettings.selector, initLabSharingSettingsModal )
        .on( 'click', $labAssociate.selector, initLabAssociateEquipmentModal );
      $( $equipment.selector )
        .off()
        .on( 'click', $equipmentSettings.selector, flipEquipmentCard )
        .on( 'click', $equipmentSettingsBack.selector, flipEquipmentCard )
        .on( 'click', $equipmentRename.selector, displayUserInterface )
        .on( 'click', $equipmentMove.selector, displayUserInterface )
        .on( 'click', $equipmentDelete.selector, displayUserInterface )
        .on( 'click', $equipmentShareSettings.selector, initEquipmentSharingSettingsModal )
        .on( 'click', $equipmentTypeChange.selector, initEquipmentTypeModal )
        .on( 'click', $equipmentPictures.selector, initEquipmentPicturesModal );
    };

  /* Lab Methods */

    var postLabNew = function ( e ) {
      if ( e.type === 'keydown' && e.which !== 13 ) {
        return;
      }
      e.preventDefault();
      var name = $newLabName.val(),
          $userFeedbackContainer = $( e.delegateTarget.children ).filter( '.user-feedback' ),
          isActiveTour           =  ( null !== tour && typeof tour.labPromise !== 'undefined' && tour.labPromise.state() === 'pending' ) ? true : false;

      if ( typeof name === 'string' && name.length === 0 ) {
        userFeedbackController( $userFeedbackContainer, 'warning', 'You must enter a new name', 2500 );
        return;
      }

      $.post( '/labadmin/new-lab', { name: name } )
        .done( function ( response ) {
          if ( response.err ) {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 2500 );
              if ( isActiveTour ) { tour.labPromise.reject(); }
            return;
          } else if ( response.msg === 'Created' ) {
            var node = $.parseHTML( response.html );
            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 1500, function(){
              $createLabForm
                .after( node )
                .addClass( 'hidden' )
                .off( 'click keydown' );
              $newLabName
                .val( null );
              rebindListeners();
              if ( isActiveTour ) { tour.labPromise.resolve(); }
            });
          }
          } )
          .fail( function ( xhr ) {
            userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 2500 );
            if ( isActiveTour ) { tour.labPromise.reject(); }
          } );
    };

    var postLabDelete = function( e ) {
      var $userMessageContainer   = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer  = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          labId                   = e.data.dataset.labId;

      $.post('/labadmin/lab-delete', { id: labId })
        .done( function( response ) {
          if ( response.msg === 'Success' ) {
            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 2500, function() { messagesController( $userMessageContainer, 'fast', function() { $( e.data.target ).fadeOut('fast', function() { $(this).remove(); } ); } ); } );
          } else if ( response.err ) {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 3000 );
          }
        })
        .fail( function( xhr ) {
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 3000 );
        });
    };

    var postLabRename = function( e ) {
      if ( e.type === 'keydown' && e.which !== 13 ) {
        return;
      }
      e.preventDefault();

      var $userMessageContainer   = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer  = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          $nameContainer          = $( e.delegateTarget.children ).filter( 'input.name' ),
          oldName                 = e.data.dataset.labName,
          newName                 = $nameContainer.val(),
          labId                   = e.data.dataset.labId;

      if ( newName.length === 0 || newName === oldName ) {
        userFeedbackController( $userFeedbackContainer, 'warning', 'You must enter a new name.', 3000 );
        return;
      }

      $.post( '/labadmin/lab-name', { id: labId, name: newName } )
        .done( function( response ) {
          if ( response.msg === 'Saved' ) {
            var node = $.parseHTML( response.html );
            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 2500, function() { messagesController( $userMessageContainer, 'fast', function() { $( e.data.target ).replaceWith( node ); $nameContainer.val( null ); });});
          } else {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 3000 );
          }
        })
        .fail( function( xhr ) {
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 3000 );
        });
    };

    var initLabAssociateEquipmentModal = function( e ) {
      e.preventDefault();
      var data                       = ( e.delegateTarget.dataset ) ? e.delegateTarget.data : $( e.delegateTarget ).data(),
          $equipmentAssociationCode  = $( 'input#associationCode' ),
          $equipmentSelectGroup      = $( 'div.equipmentSelect' ),
          $equipmentSelectDropDown   = $( 'select#equipmentSelectDropDown' ),
          $equipmentAssociateSubmit  = $( 'a#associateEquipmentButton' ),
          $equipmentAssociateMessage = $( 'div#equipmentAssociateMessage' ),
          token                      = '723vqH3f4yJPCAv9msh6CDeVg',
          placeholderOption          = $( '<option value="" disabled selected style="display:none;">Select Equipment</option>' );

          $equipmentSelectDropDown
            .append( placeholderOption );

        $( e.delegateTarget )
          .find( $equipment.selector )
          .map( function( idx, elem ) {
            var elemdata = elem.dataset;
            if ( typeof elem.dataset === 'undefined' ) {
              elemdata = $( elem ).data();
            }
            var option = $( '<option value="' + elemdata.equipmentId + '">' + elemdata.equipmentName + '</option>' );
            $equipmentSelectDropDown.append( option );
          });

      // Methods
      var lockInput = function() {
        $equipmentAssociationCode
          .attr({
            disabled: 'disabled',
            readonly: 'readonly'
          });
      };
      var unlockInput = function() {
        $equipmentAssociationCode
          .removeAttr( 'disabled' )
          .removeAttr( 'readonly' );
      };
      var getEchoThing = function( code ) {
        lockInput();
        if ( code.length === 6 ) {
          $.get( 'https://api.thingdom.io/1.3/echo_thing', { token: token, code: code } )
            .done( function( response ) {
              if ( response.response === 'success' && response.data.length >= 1 ) {
                $equipmentAssociateSubmit
                  .text( 'Associate' )
                  .addClass( 'disabled' );
                $equipmentSelectGroup
                  .removeClass( 'hidden' );
              } else {
                unlockInput();
                userFeedbackController( $equipmentAssociateMessage, 'danger', 'Inavlid code.', 2500 );
              }
            })
            .fail( function( xhr ) {
              unlockInput();
              userFeedbackController( $equipmentAssociateMessage, 'danger', 'There was an error in the request.', 2500 );
            });
        } else {
          unlockInput();
          userFeedbackController( $equipmentAssociateMessage, 'danger', 'Check code length, try again.', 2500 );
        }
      };
      var postThingdomAuthEchoApp = function( code, echoId ) {
        if ( code && echoId ) {
          $.ajax({
            type: 'POST',
            url: 'https://api.thingdom.io/1.3/auth_echo_app',
            data: JSON.stringify({ code: code, echo_id: echoId, token: token }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
            })
            .done( function( response ) {
              if ( response.response === "success" ) {
                postLabAssociateEquipment( echoId, response.thing_id );
              }  else {
                unlockInput();
                userFeedbackController( $equipmentAssociateMessage, 'danger', 'Unable to associate code.', 2500 );
              }
            })
            .fail( function( xhr ) {
              userFeedbackController( $equipmentAssociateMessage, 'danger', 'Unable to associate code.', 2500 );
          });
        }
      };
      var postLabAssociateEquipment = function( echoId, thingId ) {
        if ( echoId && thingId  ) {
          $.post( '/labadmin/associate', { echo_id: echoId, thing_id: thingId } )
            .done( function( response ) {
              if ( response.msg === "Associated" ) {
                var node = $( response.html ),
                    $oldCard =  $equipment.filter( '[data-equipment-id="' + echoId + '"]' );
                userFeedbackController( $equipmentAssociateMessage, 'success', response.msg, 2500, function( e ) { $oldCard.replaceWith( node ); $labEquipmentAssociateModal.modal( 'hide' ); } );
              } else {
                unlockInput();
                userFeedbackController( $equipmentAssociateMessage, 'danger', 'Association failed, try again.', 2500 );
              }
            })
            .fail( function( xhr ) {
              unlockInput();
              userFeedbackController( $equipmentAssociateMessage, 'danger', 'Association failed, try again.', 2500 );
            });
        }
      };
      var changeHandler = function( e ) {
        $equipmentAssociateSubmit
          .text( 'Associate' )
          .removeClass( 'disabled' );
      };
      var clickHandler = function( e ) {
        switch ( e.currentTarget.innerText ) {
          case 'Validate':
            getEchoThing( $equipmentAssociationCode.val() );
            break;
          case 'Associate':
            postThingdomAuthEchoApp( $equipmentAssociationCode.val(), $equipmentSelectDropDown.val() );
            break;
          default:
            return false;
        }
      };
      var keyHandler = function( e ) {
        if ( e.currentTarget.value.length === 6 && e.which !== 8 && e.which !== 46 ) {
          if ( e.which === 13 ) {
            getEchoThing( e.currentTarget.value );
            return;
          }
          e.preventDefault();
          $equipmentAssociateSubmit
            .text( 'Validate' )
            .removeClass( 'disabled' );
          return;
        } else {
          $equipmentAssociateSubmit
            .addClass( 'disabled' );
        }
        if ( e.which === 13 ) {
          e.preventDefault();
          return;
        }
      };

      // Listeners

      $labEquipmentAssociateModal
        .on( 'change', $equipmentSelectDropDown.selector, changeHandler )
        .on( 'click', $equipmentAssociateSubmit.selector, clickHandler )
        .on( 'keydown keyup', $equipmentAssociationCode.selector, keyHandler );

      // Show Modal
      $labEquipmentAssociateModal
        .modal( 'show' );

      // Listen for modal close and then clean up & detach listeners
      $labEquipmentAssociateModal
        .on( 'hidden.bs.modal', function( e ) {
          unlockInput();
          $equipmentAssociationCode
            .val( null );
          $equipmentSelectDropDown
            .html( null );
          $equipmentSelectGroup
            .addClass( 'hidden' );
          $equipmentAssociateSubmit
            .text( 'Associate' )
            .addClass( 'disabled' );
          $labEquipmentAssociateModal
            .off( 'click change keydown' );
        } );
    };

    var initLabSharingSettingsModal = function( e ) {
      e.preventDefault();
      var data                       = ( e.delegateTarget.dataset ) ? e.delegateTarget.dataset : $( e.delegateTarget ).data(),
          $labShareHeader            = $( 'strong#labShareHeaderName' ),
          $labShareOption            = $( 'select#labShareOption'),
          $labShareLink              = $( 'input#labShareLink' ),
          $labShareNewLinkButton     = $( 'button#newLabLinkButton' ),
          $labShareEmailLinkButton   = $( 'button#emailLabLinkButton' ),
          $labShareSendEmailButton   = $( 'button#sendShareLabLinkEmail' ),
          $labShareCancelEmailButton = $( 'button#cancelLabShareSend' ),
          $labShareEmailForm         = $( 'div#shareLabLinkEmailMiniForm' ),
          $labShareEmailInput        = $( 'input#shareLabLinkEmail' ),
          $labShareAdminOnly         = $( 'input#labShareAdminOnly' ),
          $labShareSubmit            = $( 'a#updateLabShareButton' ),
          $labShareModalMessage      = $( 'div#labShareModalMessage' );

      $labShareHeader
        .text( data.labName );

      for ( var i = 1; i <= 3; i++ ) {
        if ( i !== parseInt( data.labShareOptionId ) ) {
          $labShareSettingsModal
            .find( 'li#labShareDescription' + i )
            .addClass( 'hidden' );
        } else {
          $labShareSettingsModal
            .find( 'li#labShareDescription' + i )
            .removeClass( 'hidden' );
        }
      }

      $labShareOption
        .val( data.labShareOptionId )
        .change();

      $labShareLink
        .val( data.labUrl );

      switch ( parseInt( data.labShareOptionId ) ) {
        case 1:
          $labShareEmailLinkButton
            .addClass( 'disabled' )
            .prop( 'disabled', true );
          break;
        case 2:
        case 3:
          $labShareEmailLinkButton
            .removeClass( 'disabled' )
            .prop( 'disabled', false );
          break;
        default:
          break;
      }

      $labShareAdminOnly
        .iCheck( ( parseInt( data.labShareOptionAdminOnly ) === 1 ) ? 'check' : 'uncheck' )
        .val( ( parseInt( data.labShareOptionAdminOnly ) === 1 ) ? 'on' : 'off' );

      // Methods

      var fixShareOptionUI = function( e ) {
        var newValue = parseInt( $( e.target ).val() );

        for ( var i = 1; i <= 3; i++ ) {
          if ( i !== newValue ) {
            $labShareSettingsModal
              .find( 'li#labShareDescription' + i )
              .addClass( 'hidden' );
          } else {
            $labShareSettingsModal
              .find( 'li#labShareDescription' + i )
              .removeClass( 'hidden' );
          }
        }

        switch ( newValue ) {
          case 1:
            $labShareEmailLinkButton
              .addClass( 'disabled' )
              .prop( 'disabled', true );
            break;
          case 2:
          case 3:
            $labShareEmailLinkButton
              .removeClass( 'disabled' )
              .prop( 'disabled', false );
            break;
          default:
            break;
        }
      };

      var fixAdminShareOptionInput = function( e ) {
        if ( $( e.target ).val() === 'on' ) {
          $( e.target ).val( 'off' );
        } else {
          $( e.target ).val( 'on' );
        }
        $( e.target ).iCheck( 'toggle' );
      };

      var postLabShareNewLink = function( e ) {
        e.preventDefault();
        $.post('/labadmin/lab-url', { id: data.labId } )
          .done( function( response ) {
            if ( response.err ) {
              userFeedbackController( $labShareModalMessage, 'danger', response.msg, 2500 );
            } else if ( response.msg === 'Updated' ) {
              userFeedbackController( $labShareModalMessage, 'success', response.msg, 1500 );
              var newUrl =  response.url;
              data.labUrl = newUrl;
              $( e.delegateTarget ).attr( 'data-lab-url', newUrl );
              $labShareLink.val( newUrl );
            }
          })
          .fail( function( xhr) {
            userFeedbackController( $labShareModalMessage, 'danger', 'There was an error in your request.', 2500 );
          });
      };

      var sendShareLabEmail = function ( e ) {
        e.preventDefault();

        var address = $labShareEmailInput.val();

        $.post( '/labadmin/share-lab', { id: data.labId, mailto: address } )
          .done( function( data, textStatus ) {
            userFeedbackController( $labShareModalMessage, 'success', data.msg, 2500 );
            $labShareSendEmailButton
              .addClass( 'disabled' )
              .prop( 'disabled', true );
            $labShareEmailForm
              .addClass( 'hidden' );
            $labShareEmailInput
              .val( null );
          })
          .fail( function( data, textStatus ) {
             userFeedbackController( $labShareModalMessage, 'danger', 'There was an error in your request, your message failed to send.', 2500 );
          });
      };

      var postLabShareSettings = function( e ) {
        e.preventDefault();

        var labShareOptionValue = parseInt( $labShareOption.val() ),
            labShareOptionData =  parseInt( data.labShareOptionId ),
            adminOptionValue = $labShareAdminOnly.val(),
            adminOptionValueTernary = ( adminOptionValue === 'on' ) ? 1 : 0,
            adminOptionDataTernary = ( data.labShareOptionAdminOnly === 1 ) ? 'on' : 'off';

        if ( labShareOptionValue === labShareOptionData && adminOptionValue === adminOptionDataTernary ) {
          userFeedbackController( $labShareModalMessage, 'warning', 'Nothing to save.', 2500 );
          return;
        }

        $.post('/labadmin/lab-share', { id: data.labId, share_option: labShareOptionValue, admin_option: adminOptionValueTernary } )
          .done( function( response ) {
            if ( response.err ) {
              userFeedbackController( $labShareModalMessage, 'danger', response.msg, 2500 );
            } else if ( response.msg === 'Saved' ) {
              userFeedbackController( $labShareModalMessage, 'success', response.msg, 1500, function() { $labShareSettingsModal.modal( 'hide' ); });
              $( e.delegateTarget )
                .attr( 'data-lab-share-option-id', labShareOptionValue )
                .attr( 'data-lab-share-option-admin-only', adminOptionValueTernary );
              data.labShareOptionId = labShareOptionValue;
              data.labShareOptionAdminOnly = adminOptionValueTernary;
            }
          })
          .fail( function( xhr ) {
            userFeedbackController( $labShareModalMessage, 'danger', 'There was an error in your request.', 2500 );
          });
      };

      // Listeners

      $labShareSettingsModal
        .on( 'ifClicked', $labShareAdminOnly.selector, fixAdminShareOptionInput )
        .on( 'keyup', $labShareEmailInput.selector, function ( e ) { $labShareSendEmailButton.removeClass( 'disabled' ); } )
        .on( 'change', $labShareOption.selector, fixShareOptionUI )
        .on( 'click', $labShareNewLinkButton.selector, postLabShareNewLink )
        .on( 'click', $labShareEmailLinkButton.selector, function ( e ) { e.preventDefault(); $labShareEmailForm.removeClass( 'hidden' ); } )
        .on( 'click', $labShareSendEmailButton.selector, sendShareLabEmail )
        .on( 'click', $labShareCancelEmailButton.selector, function( e ) { e.preventDefault(); $labShareEmailForm.addClass( 'hidden' ); $labShareSendEmailButton.addClass( 'disabled' ); $labShareEmailInput.val( null ); } )
        .on( 'click', $labShareSubmit.selector, postLabShareSettings );

      // Show Modal
      $labShareSettingsModal
        .modal( 'show' );

      // Listen for modal close and then clean up & detach listeners
      $labShareSettingsModal
        .on( 'hidden.bs.modal', function( e ) {
          $labShareSettingsModal
            .off();
          $labShareHeader
            .text( '' );
          $labShareLink
            .val( '' );
          $labShareModalMessage
            .html( '' )
            .addClass( 'hidden' );
          $labShareEmailForm
            .addClass( 'hidden' );
          $labShareSendEmailButton
            .addClass( 'disabled' );
          $labShareEmailInput
            .val( null );
        } );
    };

  /* Lab Listeners */

    $lab
      .off()
      .on( 'click', $labRename.selector, displayUserInterface )
      .on( 'click', $labDelete.selector, displayUserInterface )
      .on( 'click', $equipmentNew.selector, displayUserInterface)
      .on( 'click', $labShareSettings.selector, initLabSharingSettingsModal )
      .on( 'click', $labAssociate.selector, initLabAssociateEquipmentModal );

  /* Equipment Methods */

    var flipEquipmentCard = function( e ) {
      $( e.delegateTarget )
        .toggleClass( 'active' );
    };

    var addNodeToLab = function( lab, node ) {
      lab.prepend( node );
      rebindListeners();
    };

    var postNewEquipment = function ( e ) {
      if ( e.type === 'keydown' && e.which !== 13 ) {
        return;
      }

      e.preventDefault();

      var $newEquipmentMessageContainer = $( e.delegateTarget ),
          $userMessageContainer         = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer        = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          $nameContainer                = $( e.delegateTarget.children ).filter( 'input.name' ),
          name                          = $nameContainer.val(),
          labId                         = e.data.dataset.labId,
          isActiveTour                  = ( null !== tour && typeof tour.equipmentPromise !== 'undefined' && tour.equipmentPromise.state() === 'pending' ) ? true : false;

      if ( name.length === 0 ) {
        userFeedbackController( $userFeedbackContainer, 'warning', 'You must enter a new name.', 2500 );
        return;
      }

      $.post( '/labadmin/new-equipment', {
          labId: labId,
          name: name
        } )
        .done( function ( response ) {
          if ( response.msg === 'Created' ) {
            var node = $.parseHTML( response.html ),
                lab  = $( $lab.selector ).filter( '[data-lab-id="' + labId + '"]' ).find( '.box-content' );
            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 1500, function () { messagesController( $userMessageContainer, 'fast', function () { $nameContainer.val( null ); addNodeToLab( lab, node ); if ( isActiveTour ) { tour.equipmentPromise.resolve(); } } );
                          } );
          } else if ( response.err ) {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 2500 , function() { hideUserInterface( e ); } );
            if ( isActiveTour ) { tour.equipmentPromise.reject(); }
          }
        } )
        .fail( function ( xhr ) {
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 5000 );
          if ( isActiveTour ) { tour.equipmentPromise.reject(); }
        } );
    };

    var postEquipmentRename = function( e ) {
      if ( e.type === 'keydown' && e.which !== 13 ) {
        return;
      }

      e.preventDefault();

      var $renameMessageContainer = $( e.delegateTarget ),
          $userMessageContainer   = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer  = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          $nameContainer          = $( e.delegateTarget.children ).filter( 'input.name' ),
          oldName                 = $nameContainer.attr( 'placeholder' ),
          newName                 = $nameContainer.val(),
          equipmentId             = e.data.dataset.equipmentId;

      if ( newName.length === 0 || newName === oldName ) {
        userFeedbackController( $userFeedbackContainer, 'warning', 'You must enter a new name.', 2500 );
        return;
      }

      $.post( '/labadmin/equipment-name', { id: equipmentId, name: newName } )
        .done( function( response ) {
          if ( response.msg === 'Saved' ) {
            var node = $.parseHTML( response.html );
            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 2500, function() { messagesController( $userMessageContainer, 'fast', function() { $( e.data.target ).replaceWith( node ); $nameContainer.val( null ); } ); } );
          } else {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 3500 );
          }
        })
        .fail( function( xhr ) {
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 2500 );
        });
    };

    var postEquipmentMoveLab = function( e ) {
      e.preventDefault();

      var $moveMessageContainer   = $( e.delegateTarget ),
          $userMessageContainer   = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer  = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          newLabId                = e.delegateTarget.children['lab-list'].value,
          equipmentId             = e.data.dataset.equipmentId;

      $.post( '/labadmin/equipment-move-lab', { id: equipmentId, labId: newLabId } )
        .done( function( response ) {
          if ( response.msg === 'Saved' ) {
            var node = $.parseHTML( response.html ),
                lab = $( $lab.selector ).filter( '[data-lab-id="' + newLabId + '"]' ).find( '.box-content' );

            userFeedbackController( $userFeedbackContainer, 'success', response.msg, 2500, function() { messagesController( $userMessageContainer, 'fast', function() { addNodeToLab( lab, node ); if ( lab.length > 0 ) { $( e.data.target ).remove(); } } ); } );
          } else if ( response.err ) {
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 3000 );
          }
        })
        .fail( function( xhr ) {
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 3000 );
        });
    };

    var postEquipmentDelete = function( e ) {
      e.preventDefault();

      var $deleteMessageContainer = $( e.delegateTarget ),
          $userMessageContainer   = $( e.delegateTarget.parentNode ),
          $userFeedbackContainer  = $( e.delegateTarget.parentNode.children ).filter( 'div.user-feedback' ),
          equipmentId             = e.data.dataset.equipmentId;

      $.post( '/labadmin/equipment-delete', { id: equipmentId } )
        .done( function( response ) {
          if ( response.err ) {
            $userFeedbackContainer.addClass('fadeout');
            userFeedbackController( $userFeedbackContainer, 'danger', response.msg, 2500, function(){ $userFeedbackContainer.removeClass('fadeout');});

            return;
          }
        $userFeedbackContainer.addClass('fadeout');
          $deleteMessageContainer.addClass('fadeout');
          var lab = $( $lab.selector ).filter( '[data-lab-id="' + e.data.dataset.labId + '"]' );
          userFeedbackController( $userFeedbackContainer, 'success', 'Deleted', 2500, function() { messagesController( $userMessageContainer, 'fast', function() { $(document).trigger('equipment.deleted'); if ( lab.length > 0 ) { $( e.data.target ).remove(); } } );  $userFeedbackContainer.removeClass('fadeout');} );

        })

        .fail( function( xhr ) {
          $userFeedbackContainer.addClass('fadeout');
          $deleteMessageContainer.addClass('fadeout');
          userFeedbackController( $userFeedbackContainer, 'danger', 'There was an error in your request.', 2500 ,function(){ $deleteMessageContainer.removeClass('fadeout'); $userFeedbackContainer.removeClass('fadeout');});
        });
    };

    var initEquipmentTypeModal = function( e ) {
      e.preventDefault();

      var $firstRow = '<tr id="equipment-custom-row" class="even"> \
              <td><img class="avatar-small" src="//d214uw9vc04b9q.cloudfront.net/img/equipment/small/1380125044.png" alt="Unknown Equipment Type" title="Change Type"></td> \
              <td>---</td> \
              <td><button class="btn btn-blue">Create New</button></td> \
            </tr>';

      var data                         = ( e.delegateTarget.dataset ) ? e.delegateTarget.dataset : $( e.delegateTarget ).data(),
          $equipmentCard               = $( e.delegateTarget ),
          $equipmentSelectorTable      = $( '#equipment-selector-table' ),
          $equipmentSelectModalMessage = $( "div#equipmentTypeModalMessage" ),
          $equipmentPickerDataTable    = $equipmentSelectorTable.dataTable();

      // data tables init
      $equipmentPickerDataTable.fnSetColumnVis( 0, false );
      $equipmentPickerDataTable.fnSetColumnVis( 1, false );
      $equipmentPickerDataTable.fnSetColumnVis( 2, false );
      $equipmentPickerDataTable.fnSettings().aoColumns[0].bSearchable = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[1].bSearchable = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[2].bSearchable = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[3].bSearchable = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[0].bSortable   = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[1].bSortable   = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[2].bSortable   = false;
      $equipmentPickerDataTable.fnSettings().aoColumns[3].bSortable   = false;
      $equipmentPickerDataTable.fnSettings().oLanguage.sInfo          = 'Showing _TOTAL_ entries';
      $equipmentPickerDataTable.fnSettings().oLanguage.sInfoFiltered  = '(of _MAX_)';

      if ( data.parentCategoryId == 29 ) {
          // Unkown, clear all
          $equipmentPickerDataTable.fnFilter( '', 1 );
          $equipmentPickerDataTable.fnFilter( '' );
      } else if ( data.parentCategoryId == 22 ) {
          // Filter only HPU's
          $equipmentPickerDataTable.fnFilter( '22', 1 );
      } else {
          // Filter out HPU's
          $equipmentPickerDataTable.fnFilter( '^((?!22).)*$', 1, true );
      }

      // Methods
      var fixImages = function( e ) {
        $equipmentSelectorTable.find('tbody').prepend( $firstRow );
        var imgDefer = $equipmentSelectorTable.get(0).getElementsByTagName( 'img' );
        for ( var i = 0; i < imgDefer.length; i++ ) {
          if ( imgDefer[i].getAttribute( 'data-src' ) ) {
            imgDefer[i].setAttribute( 'src', imgDefer[i].getAttribute( 'data-src' ));
            imgDefer[i].removeAttribute( 'data-src' );
          }
        }
      };

      var postEquipmentType = function( e ) {
        e.preventDefault();
        var selectedData               = $equipmentPickerDataTable.fnGetData( e.currentTarget ),
            $equipmentTypeModalMessage = $equipmentTypeSelectorModal.filter;

        if( selectedData ) {
          $.post('/labadmin/equipment-type', { id: data.equipmentId, typeId: selectedData[0] } )
            .done( function( response ) {
              if ( response.err ) {
                userFeedbackController( $equipmentSelectModalMessage, 'danger', response.msg, 2500 );
              } else if ( response.msg === 'Saved' ) {
                var node = $.parseHTML( response.html );
                userFeedbackController( $equipmentSelectModalMessage, 'success', response.msg, 1500, function() { messagesController( $equipmentSelectModalMessage, 'fast', function() { $equipmentTypeSelectorModal.modal( 'hide' ); $equipmentCard.replaceWith( node ); } ); } );
              }
            })
            .fail( function( xhr) {
              userFeedbackController( $equipmentSelectModalMessage, 'danger', 'There was an error in your request.', 2500 );
            });
        } else {
          $equipmentTypeSelectorModal
            .modal( 'hide' );
          initCustomEquipmentModal( data.equipmentId );
        }
      };

      var editCustomType = function( e ) {
        e.stopImmediatePropagation();
        var selectedData = $equipmentPickerDataTable.fnGetData( $( this ).closest( 'tr' )[0] );
        $equipmentTypeSelectorModal
          .modal( 'hide' );
        initCustomEquipmentModal( data.equipmentId, selectedData[0] );
      };

      $equipmentSelectorTable
        .on( 'click', 'tbody tr', postEquipmentType )
        .on( 'click', '.edit-custom-type', editCustomType )
        .on( 'draw.dt', fixImages );

      // Listen for modal close and then clean up & detach listeners
      $equipmentTypeSelectorModal
        .on( 'show.bs.modal', fixImages )
        .on( 'hidden.bs.modal', function( e ) {
          $equipmentSelectorTable
            .off( 'click draw.dt' );
          $equipmentTypeSelectorModal
            .off( 'show.bs.modal hidden.bs.modal' );
        });

      $equipmentTypeSelectorModal
        .modal( 'show' );
    };

    var companiesPicturesShowcase = function( pics, element ) {
      //if there is an element you want to use to find the showcase then great else use default
      var $element = element instanceof jQuery ? element : $companiesPicturesModal;
      var $showcase = $element.find( '.picture-showcase' );

      //if there is html to represent the pictures then great add it
      if( pics ) {
        $showcase
          .html( pics );
      }

      //remove picture functionality
      $showcase
        .find( '.info-pic' )
        .tooltip();
      $showcase
        .find( '.remove-pic' )
        .off()
        .on( 'click', function( e ) {
          $this = $( this );

          //remove from html
          $this
            .parent()
            .remove();

          //if none left then remove showcase
          if( $showcase.find( '.remove-pic' ).length === 0 ) {
            $showcase
              .empty();
            if( $element != $companiesPicturesModal ) {
              $showcase
                .html( 'There are currently no pictures to choose from.' );
            }
          }

          //make it official
          $.ajax({
            method: 'POST',
            global: false,
            url: '/labadmin/delete-companies-picture/' + $this.attr( 'data-id' )
          });
        });

      return $showcase;
    };

    var initCustomEquipmentModal = function( id, typeId ) {
      //clear it out
      var $modBod = $equipCustomModal.find( '.modal-body' );

      $modBod
        .empty();

      //on show get the form
      $equipCustomModal
        .on( 'show.bs.modal', function( e ) {
          //grab html for modal
          $.ajax({
            global: false,
            url: '/labadmin/custom' + ( typeId ? '/' + typeId : '' )
          })
          .done( function( response ) {
            var $uploadContainer = $modBod;

            $uploadContainer
                .html( response );

            var $fileUpload      = $uploadContainer.find( '.upload-picture' ),
                $name            = $uploadContainer.find( '#equipmentCustomName' ),
                $equipmentId     = $uploadContainer.find( '#equipmentCustomEquipmentId' ),
                $equipmentTypeId = $uploadContainer.find( '#equipmentCustomTypeId' );

            //set the equipmentId
            $equipmentId
              .val( id );

            //set the type id if it exists
            if ( typeId ) {
              $equipmentTypeId
                .val( typeId );
            }

            //display it with style
            $fileUpload
              .uniform();

            //enable functionality of company pictures like removing them
            customPictureOnClick( companiesPicturesShowcase( null, $uploadContainer ), $uploadContainer );

            //handle name input
            $name
              .off()
              .on( 'input', customValidate );

            //clear for now
            customValidate();

            //setup file uploading for equipment pictures one time
            $fileUpload
              .fileupload({
                dataType: 'json',
                url: '/labadmin/companies-pictures',
                global: false,
                start: function ( e, data ) {
                  //disallow form submit now
                  $uploadContainer
                    .find( '.selected' )
                    .removeClass( 'selected' )
                    .off();
                  customValidate();
                },
                progressall: function (e, data) {
                    //the upload progress is a combination of file upload and the time it takes for the server to process it
                    var progress  = Math.round( data.loaded / data.total * 50 ),
                        $progress = $uploadContainer.find( '.progress' ),
                        $bar      = $progress.find( '.progress-bar' );
                    $bar
                      .css( 'width', progress + '%' )
                      .attr( 'data-original-title', progress + '%' );
                    $progress
                      .show();
                },
                done: function ( e, data ) {
                    $uploadContainer
                      .find( '.progress' )
                      .hide();
                    if ( data.result ) {
                      //reset the form stuff
                      $uploadContainer
                        .find( ".filename" )
                        .text( 'No file selected' );
                      //add pics
                      var $showcase = companiesPicturesShowcase( data.result, $uploadContainer );
                      customPictureOnClick( $showcase, $uploadContainer );
                      //add selected to the one that just loaded
                      $showcase
                        .find( 'img:last' )
                        .on( 'load', function() {
                          $( this )
                            .addClass( 'selected' );
                          customValidate();
                        });
                    } else {
                      //show error
                      $uploadContainer
                        .find( '.file-upload-error' )
                        .show();
                    }
                }
              });

          });
        });

      //clear listeners on modal hidden
      $equipCustomModal
        .on( 'hidden.bs.modal', function( e ) {
          $equipCustomModal
            .off( 'show.bs.modal hidden.bs.modal' );
        });

      //show the modal
      $equipCustomModal
        .modal( 'show' );
    };

    var customPictureOnClick = function( $showcase, $uploadContainer ) {
      var $img = $showcase.find( 'img' );
      $img
        .off();
      $img
        .on('click', function() {
          var $this = $(this);
          $showcase
            .find( 'img' )
              .removeClass( 'selected' )
              .off( 'load' );
          $this
            .addClass( 'selected' );
          $this
            .siblings( '.remove-pic' )
            .on( 'click', function () {
              $this
                .removeClass( 'selected' );
              customValidate();
            });
          customValidate();
        });

      $showcase
        .find( '.info-pic' )
        .tooltip();
    };

    var customValidate = function() {
      var $submitButton = $equipCustomModal.find( '.submit-button' );
      $submitButton
        .off();

      if ( $equipCustomModal.find( '.selected' ).length && $equipCustomModal.find( '#equipmentCustomName' ).val().trim() != '' ) {
          $submitButton
            .removeClass( 'disabled' );
          $submitButton
            .on( 'click', function( e ) {

              var $equipCustModMsg = $( '#equipmentCustomMessage' );

              $equipCustomModal
                .find( '#equipmentCustomPicId' )
                .val( $equipCustomModal.find( '.selected' ).siblings( 'i' ).attr( 'data-id' ) );
              $submitButton
                .addClass( 'disabled' );

              $.ajax({
                type: 'POST',
                url: '/labadmin/custom',
                data: $equipCustomModal.find( 'form' ).serialize(),
                global: false
              })
              .done( function( response ) {
                if ( response ) {
                  if( typeof response === "string" ) {
                    //specific error
                    userFeedbackController( $equipCustModMsg, response, 2500 );
                  } else if ( response.html ) {
                    var node = $.parseHTML( response.html );
                    userFeedbackController( $equipCustModMsg, 'success', response.msg, 3500, function() { $( '.equipment[data-equipment-id="' + $( '#equipment-custom-modal #equipmentCustomEquipmentId' ).val() + '"]' ).replaceWith( node ); $equipCustomModal.modal( 'hide' ); } );
                  } else {
                    // @TODO when in doubt, reload?
                    window.location.reload( true );
                  }
                } else {
                  //generic error
                  userFeedbackController( $equipCustModMsg, 'There was an issue saving the equipment type. Please try again.', 2500 );
                }
              });
            });
      } else {
        $submitButton
          .addClass( 'disabled' );
      }
    };

    var initEquipmentPicturesModal = function( e ) {
      e.preventDefault();

      var id = $( this ).attr( 'data-id' );

      var equipmentPicturesShowcase = function( response ) {
        $showcase = $equipPicturesModal.find( '.picture-showcase' );

        if ( response ) {
          $showcase
            .html( response );
        }

        $showcase
          .find( '.associate-pic' )
          .off();
        $showcase
          .find( '.unassociate-pic' )
          .off();

        //remove picture functionality
        $showcase
          .find( '.associate-pic' )
          .click( function( e ) {
            $this = $(this);

            //show selected now
            $this
              .removeClass( 'associate-pic icon-plus text-success' )
              .addClass( 'unassociate-pic icon-remove text-danger' );

              //make it official
              $.ajax( {
                  method: 'POST',
                  global: false,
                  url: '/labadmin/associate-equipment-picture/' + $this.attr( 'data-id' ) + '/' + $this.attr( 'data-equipment-id' )
              } );

            equipmentPicturesShowcase();
          });

        //remove picture functionality
        $showcase
          .find( '.unassociate-pic' )
          .click( function( e ) {
            $this = $( this );

            //show deselected now
            $this
              .removeClass( 'unassociate-pic icon-remove text-danger' )
              .addClass( 'associate-pic icon-plus text-success' );

            //make it official
            $.ajax({
              method: 'POST',
              global: false,
              url: '/labadmin/unassociate-equipment-picture/' + $this.attr( 'data-id' ) + '/' + $this.attr( 'data-equipment-id' )
            });

            equipmentPicturesShowcase();
          });

        };

      //clear it out
      $equipPicturesModal.find('.picture-showcase').empty();

      //on show get the showcase
      $equipPicturesModal
        .on( 'show.bs.modal', function( e ) {
        //grab html of pictures showcasing previously existing
          $.ajax({
            global: false,
            url: '/labadmin/equipment-pictures/'+id
          })
          .done(equipmentPicturesShowcase);
        });

      //clear listeners on modal hidden
      $equipPicturesModal
        .on( 'hidden.bs.modal', function( e ) {
          $equipPicturesModal.off( 'show.bs.modal hidden.bs.modal' );
        });

      //show the modal
      $equipPicturesModal
        .modal( 'show' );
    };

    var initCompaniesPicturesModal = function( e ) {

      if( e ) {
        e.preventDefault();
      }

      //clear it out
      $companiesPicturesModal
        .find( '.picture-showcase' );

      //hide the error, progress
      $companiesPicturesModal
        .find( '.file-upload-error' )
        .hide();
      $companiesPicturesModal
        .find( '.progress' )
        .hide();

      // clear out any existing listeners
      $companiesPicturesModal
        .off( 'show.bs.modal hidden.bs.modal' );

      //reset the form stuff
      $companiesPicturesModal
        .find( ".filename" )
        .text( 'No file selected' );

      $companiesPicturesModal
        .on( 'show.bs.modal', function( e ) {
          //grab html of pictures showcasing previously existing
          $.ajax({
            global: false,
            url: '/labadmin/companies-pictures'
          })
          .done( companiesPicturesShowcase );
        });

      //clear listeners on modal hidden
      $companiesPicturesModal
        .on( 'hidden.bs.modal', function( e ) {
          $companiesPicturesModal.off( 'show.bs.modal hidden.bs.modal' );
        });

      //show the modal
      $companiesPicturesModal
        .modal( 'show' );
    };

    var companiesPicturesProgress = function ( data ) {

        //the upload progress is a combination of file upload and the time it takes for the server to process it
        var progress  = Math.round( 50 + data / 100 * 50 ),
            $progress = $( '.file-upload-progress' ),
            $bar      = $progress.find( '.progress-bar' );

        $bar
          .css( 'width', progress + '%' )
          .attr( 'data-original-title', progress + '%' );
        $progress
          .show();

    };

    var initEquipmentSharingSettingsModal = function( e ) {
      e.preventDefault();
      var data                           = ( e.delegateTarget.dataset ) ? e.delegateTarget.dataset : $( e.delegateTarget ).data(),
          $equipmentShareHeader          = $( 'strong#equipmentShareHeaderName' ),
          $equipmentShareOption          = $( 'select#equipmentShareOption'),
          $equipmentShareLink            = $( 'input#equipmentShareLink' ),
          $equipmentShareNewLinkButton   = $( 'button#newEquipmentLinkButton' ),
          $equipmentShareEmailLinkButton = $( 'button#emailEquipmentLinkButton' ),
          $sendEquipmentEmailButton      = $( 'button#sendShareEquipmentLinkEmail' ),
          $cancelEquipmentEmailButton    = $( 'button#cancelShareEquipmentSend' ),
          $shareEquipmentEmailForm       = $( 'div#shareEquipmentLinkEmailMiniForm' ),
          $shareEquipmentEmailInput      = $( 'input#shareEquipmentLinkEmail' ),
          $equipmentShareSubmit          = $( 'a#updateEquipmentShareButton' ),
          $equipmentShareModalMessage    = $( 'div#equipmentShareModalMessage' );

      $equipmentShareHeader
        .text( data.equipmentName );

      for ( var i = 1; i <= 3; i++ ) {
        if ( i !== parseInt( data.equipmentShareOptionId ) ) {
          $equipmentShareSettingsModal
            .find( 'li#equipmentShareDescription' + i )
            .addClass( 'hidden' );
        } else {
          $equipmentShareSettingsModal
            .find( 'li#equipmentShareDescription' + i )
            .removeClass( 'hidden' );
        }
      }

      $equipmentShareOption
        .val( data.equipmentShareOptionId )
        .change();

      $equipmentShareLink
        .val( data.equipmentUrl );

      switch ( parseInt( data.equipmentShareOptionId ) ) {
        case 1:
          $equipmentShareEmailLinkButton
            .addClass( 'disabled' )
            .prop( 'disabled', true );
          break;
        case 2:
        case 3:
          $equipmentShareEmailLinkButton
            .removeClass( 'disabled' )
            .prop( 'disabled', false );
          break;
        default:
          break;
      }

      // Methods

      var fixShareOptionUI = function( e ) {

        var newValue = parseInt( $( e.target ).val() );

        for ( var i = 1; i <= 3; i++ ) {
          if ( i !== newValue ) {
            $equipmentShareSettingsModal
              .find( 'li#equipmentShareDescription' + i )
              .addClass( 'hidden' );
          } else {
            $equipmentShareSettingsModal
              .find( 'li#equipmentShareDescription' + i )
              .removeClass( 'hidden' );
          }
        }

        switch ( newValue ) {
          case 1:
            $equipmentShareEmailLinkButton
              .addClass( 'disabled' )
              .prop( 'disabled', true );
            break;
          case 2:
          case 3:
            $equipmentShareEmailLinkButton
              .removeClass( 'disabled' )
              .prop( 'disabled', false );
            break;
          default:
            break;
        }
      };

      var postEquipmentShareNewLink = function( e ) {
        e.preventDefault();

        $.post('/labadmin/equipment-url', { id: data.equipmentId } )
          .done( function( response ) {
            if ( response.err ) {
              userFeedbackController( $equipmentShareModalMessage, 'danger', response.msg, 2500 );
            } else if ( response.msg === 'Updated' ) {
              userFeedbackController( $equipmentShareModalMessage, 'success', response.msg, 1500 );
              var newUrl = response.url;
              data.equipmentUrl = newUrl;
              $( e.delegateTarget ).attr( 'data-equipment-url', newUrl );
              $equipmentShareLink.val( newUrl );
            }
          })
          .fail( function( xhr) {
            userFeedbackController( $equipmentShareModalMessage, 'danger', 'There was an error in your request.', 2500 );
          });
      };

      var sendShareEquipmentEmail = function ( e ) {

        var address = $shareEquipmentEmailInput.val();

        $.post( '/labadmin/share-equipment', { id: data.equipmentId, mailto: address } )
          .done( function( data, textStatus ) {
            userFeedbackController( $equipmentShareModalMessage, 'success', data.msg, 2500 );
            $sendEquipmentEmailButton
              .addClass( 'disabled' )
              .prop( 'disabled', true );
            $shareEquipmentEmailForm
              .addClass( 'hidden' );
            $shareEquipmentEmailInput
              .val( null );
          })
          .fail( function( data, textStatus ) {
            userFeedbackController( $labShareModalMessage, 'danger', 'There was an error in your request, your message failed to send.', 2500 );
          });

      };

      var postEquipmentShareSettings = function( e ) {
        e.preventDefault();

        var equipmentShareOptionValue = parseInt( $equipmentShareOption.val() ),
            equipmentShareOptionData =  parseInt( data.equipmentShareOptionId );

        if ( equipmentShareOptionValue === equipmentShareOptionData ) {
          userFeedbackController( $equipmentShareModalMessage, 'warning', 'Nothing to save.', 2500 );
          return;
        }

        $.post('/labadmin/equipment-share', { id: data.equipmentId, share_option: equipmentShareOptionValue } )
          .done( function( response ) {
            if ( response.err ) {
              userFeedbackController( $equipmentShareModalMessage, 'danger', response.msg, 2500 );
            } else if ( response.msg === 'Saved' ) {
              userFeedbackController( $equipmentShareModalMessage, 'success', response.msg, 1500, function() { $equipmentShareSettingsModal.modal( 'hide' ); });
              $( e.delegateTarget )
                .attr( 'data-equipment-share-option-id', equipmentShareOptionValue );
              data.equipmentShareOptionId = equipmentShareOptionValue;
            }
          })
          .fail( function( xhr ) {
            userFeedbackController( $equipmentShareModalMessage, 'success', 'There was an error in your request.', 2500 );
          });
      };

      // Listeners

      $equipmentShareSettingsModal
        .on( 'change', $equipmentShareOption.selector, fixShareOptionUI )
        .on( 'keyup', $shareEquipmentEmailInput.selector, function ( e ) { $sendEquipmentEmailButton.removeClass( 'disabled' ); } )
        .on( 'click', $equipmentShareEmailLinkButton.selector, function ( e ) { e.preventDefault(); $shareEquipmentEmailForm.removeClass( 'hidden' ); } )
        .on( 'click', $sendEquipmentEmailButton.selector, sendShareEquipmentEmail )
        .on( 'click', $cancelEquipmentEmailButton.selector, function( e ) { e.preventDefault(); $shareEquipmentEmailForm.addClass( 'hidden' ); $sendEquipmentEmailButton.addClass( 'disabled' ); $shareEquipmentEmailInput.val( null ); } )
        .on( 'click', $equipmentShareNewLinkButton.selector, postEquipmentShareNewLink )
        .on( 'click', $equipmentShareSubmit.selector, postEquipmentShareSettings );

      // Show Modal
      $equipmentShareSettingsModal
        .modal( 'show' );

      // Listen for modal close and then clean up & detach listeners
      $equipmentShareSettingsModal
        .on( 'hidden.bs.modal', function( e ) {
          $equipmentShareSettingsModal
            .off();
          $equipmentShareHeader
            .text( '' );
          $equipmentShareLink
            .val( '' );
          $equipmentShareModalMessage
            .html( '' )
            .addClass( 'hidden' );
          $sendEquipmentEmailButton
            .addClass( 'disabled' )
          $shareEquipmentEmailForm
            .addClass( 'hidden' );
          $shareEquipmentEmailInput
            .val( null );
        } );
    };

  /* Equipment Listeners */

    $equipment
      .off()
      .on( 'click', $equipmentSettings.selector, flipEquipmentCard )
      .on( 'click', $equipmentSettingsBack.selector, flipEquipmentCard )
      .on( 'click', $equipmentRename.selector, displayUserInterface )
      .on( 'click', $equipmentMove.selector, displayUserInterface )
      .on( 'click', $equipmentDelete.selector, displayUserInterface )
      .on( 'click', $equipmentShareSettings.selector, initEquipmentSharingSettingsModal )
      .on( 'click', $equipmentTypeChange.selector, initEquipmentTypeModal )
      .on( 'click', $equipmentPictures.selector, initEquipmentPicturesModal );

  /* Additional Methods & Initialization */

    var initLabForm = function( e ) {
      e.preventDefault();
      $createLabForm
        .removeClass( 'hidden' )
        .on( 'click', $submitNewLab.selector, { target: e.delegateTarget }, postLabNew )
        .on( 'keydown', $newLabName.selector, { target: e.delegateTarget }, postLabNew )
        .on( 'click', $cancelNewLab.selector, function( e ) {
          e.preventDefault();
          $createLabForm
            .addClass( 'hidden' )
            .off();
        })
        .find( '.new-lab-name' )
        .focus();
    };

    /* Additional Listeners */

    $labNewButton
      .on( 'click', initLabForm );

    $companiesPictures.on('click', initCompaniesPicturesModal);

      //for others that handle adding equipment cards to the dom independent of the lab admin page
    $(document).on('labadmin.rebindListeners', rebindListeners);

    //setup file uploading for equipment pictures one time
    $companiesPicturesModal.find('.upload-picture').fileupload({
        dataType: 'json',
        url: '/labadmin/companies-pictures',
        global: false,
        singleFileUploads: false,
        add: function (e, data) {
            var fileName = '';

            // uniform filename update failed.  just set the display and move on.
            for( var i = 0; i < data.files.length; i++ ) {
              fileName += data.files[i].name + (i != data.files.length - 1 ? ', ' : '');
            }
            $companiesPicturesModal.find(".filename").text( fileName );

            data.process().done(function () {
                data.submit();
            });
        },
        progressall: function (e, data) {
            //the upload progress is a combination of file upload and the time it takes for the server to process it
            var progress = Math.round(data.loaded / data.total * 50);
            var $progress = $companiesPicturesModal.find('.progress');
            var $bar = $progress.find('.progress-bar');
            $bar.css('width',progress+'%').attr('data-original-title', progress+'%');
            $progress.show();
        },
        done: function (e, data) {
            $companiesPicturesModal.find('.progress').hide();
            if(data.result) {
              initCompaniesPicturesModal();
              companiesPicturesShowcase(data.result);
            }
            else {
              //show error
              $companiesPicturesModal.find('.file-upload-error').show();
            }
        }
    });

    /**
    * START: Socket & Socket Events
    **/
    function getSocket() {
        try {
            var socket = io();

            socket.on( 'companiesPicturesProgress', companiesPicturesProgress );
        }
        catch(e) {
        }
    }
    getSocket();
    /**
    * END: Socket & Socket Events
    **/

});
