<?php

class ModalController extends BaseController
{
    protected $layout = 'layouts.no_layout';
    protected $meta = array();

    public function __construct()
    {
        $this->beforeFilter('@firewall');
    }

    public function firewall( $route, $request ) 
    {

         if ( Input::has( 'fn' ) && strpos( Input::get('fn'), 'get' ) === false ) {
           return App::abort( 403, 'Forbidden' );
        }

        if ( !isset( $_SESSION[ 'userRow' ] )) {
          if ( Request::ajax() ) {
                App::abort( 401, 'Not authenticated');
            } else {
              return Redirect::to( URL::to( '/' ) );
            }
        }
    }

    /**
     * gets a static modal when needed
     * @param  string $ns namespace for modal view
     * @return view       the rendered modal view
     */
    public function postStaticModal()
    {
      $ns = Input::get('ns');
      $modal = $this->renderStaticModal($ns);
      return Response::json(array( 'html' => $modal));
    }

    /**
     * magically takes post data to return a modal with dynamic data
     * @param  string $ns  namespace for the modal view (ex. labadmin.modals.equipmentSelector)
     * @param  string $var variable name to declare when passing data to modal ( ex. equipmentData )
     * @param  string $cls class name from which to get data ( ex. Equipment )
     * @param  string $fn  function name, within class, to call for data ( ex. getEquipmentOptions )
     * @return view        the rendered modal view...
     */
    public function postDynamicModal()
    {
      $ns = Input::get('ns');
      $var = Input::get('var');
      $cls = Input::get('cls');
      $fn = Input::get('fn');

      $modal = $this->renderDynamicModal($ns, $var, $cls, $fn);
      return Response::json( array( 'html' => $modal ));
    }

    private function renderStaticModal($ns)
    {
      $modal = View::make( $ns )->render();
      return $modal;
    }

    private function renderDynamicModal($ns, $var, $cls, $fn)
    {
      $class = new $cls(); // can be used to access both static and non-static methods (but not static properties)
      return View::make($ns)->with($var, $class->$fn())->render();
    }

}
