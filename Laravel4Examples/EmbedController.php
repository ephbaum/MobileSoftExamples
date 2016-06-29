<?php

class EmbedController extends BaseController
{
    protected $layout = 'layouts.no_layout';
    protected $meta = array(
        'breadcrumbs' => false
    );
    protected $company;
    protected $equipment;
    protected $embed;
    protected $logger;

    public function __construct(Company $company, Equipment $equipment, Embed $embed)
    {
        $this->company = $company;
        $this->equipment = $equipment;
        $this->embed = $embed;
        $this->logger = Logger::getInstance();
    }

    public function getFrame($id)
    {
        $calledEquipment = $this->equipment->getEquipmentByUrlFragment($id);

        if (!$calledEquipment) {
          $this->logger->logDirect(Request::url(), 'Invalid Token Sent');
          App::abort(400, 'Bad Request');
        }


        $this->logger->logDirect(Request::url(), 'Embed for equipment_id '. $calledEquipment->id . ' for company_id ' . $calledEquipment->company_id );
        $this->layout->content = View::make('embed.index');
    }

    public function getContent($id)
    {
        $token = Input::get('hashToken');

        if(empty($token)) {
          // if a token wasn't passed we can't proceed
          $this->logger->logDirect(Request::url(), 'Token wasn\'t passed, we cannot proceed');
          return App::abort(403, 'Forbidden');
        }

        // validate token
        $companyAPI = $this->embed->checkToken($token);

        if(!$companyAPI) {
          // no match was found in companies__api table
          $this->logger->logDirect(Request::url(), 'No match found in companies__api table, we cannot proceed');
          return App::abort(403, 'Forbidden');
        }

        $equipment = $this->getEquipmentDetail($id);

        if($equipment->company_id != $companyAPI->company_id) {
            // API secret does not map to company ID for equipment
            $this->logger->logDirect(Request::url(), 'API secret does not map to company ID for equipment, we cannot proceed');
            return App::abort(403, 'Forbidden');
        }

        $company = $this->company->getById($equipment->company_id);
        $company = $company[0];

        $view = View::make('embed.partials.content')->with('equipment', $equipment)->render();
        return Response::json(array('html' => $view));
    }


    private function getEquipmentDetail($urlFragment)
    {
        $equipmentRecord = $this->equipment->getEquipmentByUrlFragment($urlFragment);
        $overview = $this->embed->getEquipmentData($equipmentRecord->company_id, $equipmentRecord->id);
        return $overview;
    }

}
