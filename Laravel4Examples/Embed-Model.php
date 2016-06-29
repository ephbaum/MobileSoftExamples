<?php

class Embed extends BaseModel
{
    public function getEquipmentData($companyId, $equipmentId = null)
    {
        $getEquipmentFeed = (empty($equipmentId)) ? '' : " equipment.id = ? AND ";

        $query = "SELECT equipment.*, stations.*, pcs.*,
                    equipment.name as name,
                    labs.id as labId, labs.name as labName, labs.url_fragment as labURL,
                    stations.name as stationName,
                    pcs.url_fragment as pcURL, equipment.url_fragment as equipmentURL,
                    equipment.id as equipmentId, equipment_type.name as equipmentName, equipment_type.image_name as image,
                    companies__pictures.s3name as pic,
                    equipment.equipment_state_option_id as eqState,
                    equipment_state_options.color as equipment_state_color
                  FROM equipment
                  JOIN labs ON equipment.lab_id = labs.id
                  JOIN stations ON equipment.id = stations.equipment_id AND equipment.active_station_id = stations.id
                  JOIN pcs ON stations.pc_id = pcs.id
                  JOIN equipment_type ON equipment.equipment_type_id = equipment_type.id
                  LEFT JOIN companies__pictures ON equipment_type.companies__pictures_id = companies__pictures.id
                  LEFT JOIN equipment_state_options ON equipment.equipment_state_option_id = equipment_state_options.id
                  WHERE
                    $getEquipmentFeed
                    equipment.company_id = ?
                  ORDER BY labName, equipment.name";

        if(!$getEquipmentFeed) {
            $params = array($companyId);
        } else {
            $params = array($equipmentId, $companyId);
        }

        $data = DB::select($query, $params);

        $returnData = array();

        // massage data before returning
        foreach($data as $row) {
            if($row->pic) {
                $row->image = Company::getPicUrl($row->pic);
            }
            else if (!empty($row->image)) {
                $row->image = '//d214uw9vc04b9q.cloudfront.net/img/equipment/mini/' . $row->image . '.png';
            } else {
                $row->image = '//d214uw9vc04b9q.cloudfront.net/img/mobile/unknown.png';
            }

            if(!empty($row->engineer)) {
                $userRow = self::userToName($row->engineer);
                if(!empty($userRow)) {
                    $row->engineer = $userRow->name;
                } else {
                    $row->engineer = 'N/A';
                }
            } else {
                $row->engineer = 'N/A';
            }

            if(!empty($row->operator)) {
                $userRow = self::userToName($row->operator);
                if(!empty($userRow)) {
                    $row->operator = $userRow->name;
                } else {
                    $row->operator = 'N/A';
                }

            } else {
                $row->operator = 'N/A';
            }

            if(empty($row->location_in_lab)) {
                $row->location = 'N/A';
            } else {
                $row->location = $row->location_in_lab;
            }

            if(empty($row->test_name)) {
                $row->test_name = 'N/A';
            }

            if($row->equipment_state_color) {
                $row->equipment_state_color = "#".$row->equipment_state_color;
            }

            switch($row->eqState) {
                case 0:
                    $row->equipment_state_text = 'Unknown';
                    $row->equipment_state_initial = 'U';
                    $row->equipment_state_class = 'grey';
                    break;
                case 1:
                    $row->equipment_state_text = 'Open';
                    $row->equipment_state_initial = 'O';
                    $row->equipment_state_class = 'blue';
                    break;
                case 2:
                    $row->equipment_state_text = 'Test';
                    $row->equipment_state_initial = 'T';
                    $row->equipment_state_class = 'green';
                    break;
                case 3:
                    $row->equipment_state_text = 'Maintenance';
                    $row->equipment_state_initial = 'M';
                    $row->equipment_state_class = 'red';
                    break;
                case 4:
                    $row->equipment_state_text = 'Calibration';
                    $row->equipment_state_initial = 'C';
                    $row->equipment_state_class = 'yellow';
                    break;
            }

            switch($row->program_state) {
                case 0:
                case 3:
                    $row->program_state_icon = 'play';
                    $row->program_state_class = 'green';
                    $row->program_state_text = 'Running';
                    break;
                case 1:
                case 4:
                    $row->program_state_icon  = 'stop';
                    $row->program_state_class = 'red';
                    $row->program_state_text = 'Stopped';
                    break;
                case 2:
                case 5:
                    $row->program_state_icon  = 'pause';
                    $row->program_state_class = 'yellow';
                    $row->program_state_text = 'Hold';
                    break;
            }

            if($row->connection_state == 1 || $row->connection_state == 2) {
                $row->connection_state_icon  = 'plug';
                $row->connection_state_class = 'green';
                $row->connection_state_text = 'Connected';
            } else {
                $row->connection_state_icon  = 'power-off';
                $row->connection_state_class = 'red';
                $row->connection_state_text = 'Disconnected';
            }

            if($row->prg_interlock_state == 0 ) {
                $row->prg_interlock_icon  = 'plus-circle';
                $row->prg_interlock_class = 'green';
                $row->prg_interlock_text = 'Clear';
            } else {
                $row->prg_interlock_icon  = 'minus-circle';
                $row->prg_interlock_class = 'red';
                $row->prg_interlock_text = 'Tripped';
            }

            if ($row->pwr_interlock_state == 0) {
                $row->pwr_interlock_icon  = 'plus-circle';
                $row->pwr_interlock_class = 'green';
                $row->pwr_interlock_text = 'Clear';
            } else {
                $row->pwr_interlock_icon  = 'minus-circle';
                $row->pwr_interlock_class = 'red';
                $row->pwr_interlock_text = 'Tripped';
            }

            // hpu_state & hpu_name
            switch($row->hpu_state) {
              case 0:
                $row->hpu_class = 'red';
                $row->hpu_icon = 'circle-o';
                $row->hpu_tooltip = 'Off';
                break;
              case 2:
                $row->hpu_class = 'yellow';
                $row->hpu_icon = 'dot-circle-o';
                $row->hpu_tooltip = 'Low';
                break;
              case 3:
                $row->hpu_class = 'green';
                $row->hpu_icon = 'circle';
                $row->hpu_tooltip = 'High';
                break;
              default:
                $row->hpu_class = 'grey';
                $row->hpu_icon = 'question-circle';
                $row->hpu_tooltip = 'Unknown';
                break;
            }

            for ($i = 1; $i <= 8; $i++) {
              switch($row->{'hsm_state_'.$i}) {
                case 0:
                  $row->{'hsm_class_'.$i} = 'red';
                  $row->{'hsm_icon_'.$i} = 'circle-o';
                  $row->{'hsm_tooltip_'.$i} = 'Off';
                  break;
                case 2:
                  $row->{'hsm_class_'.$i} = 'yellow';
                  $row->{'hsm_icon_'.$i} = 'dot-circle-o';
                  $row->{'hsm_tooltip_'.$i} = 'Low';
                  break;
               case 3:
                  $row->{'hsm_class_'.$i} = 'green';
                  $row->{'hsm_icon_'.$i} = 'circle';
                  $row->{'hsm_tooltip_'.$i} = 'High';
                  break;
               default:
                  $row->{'hsm_class_'.$i} = 'grey';
                  $row->{'hsm_icon_'.$i} = 'question-circle';
                  $row->{'hsm_tooltip_'.$i} = 'Unknown';
                  break;
              }
              if (strlen($row->{'hsm_name_'.$i}) === 0) {
                  $row->{'hsm_name_'.$i} = 'HSM '.$i;
                  $row->{'hsm_class_'.$i} = 'grey';
                  $row->{'hsm_icon_'.$i} = 'times-circle-o';
                  $row->{'hsm_tooltip_'.$i} = 'Not Connected';

              }
            }

            // get test progress data for this equipment
            $progress = MTSMemcache::getInstance()->getValue(MTSMemcache::PROGRESS_DATA, $row->equipmentId);

            if(!empty($progress)) {
                if(is_string($progress)) {
                    $progress = json_decode($progress);
                }

                $row->test_progress = ($progress->endValue === 0) ? 0 : round(($progress->signalValue / $progress->endValue) * 100);
                if($row->test_progress > 100) {
                    $row->test_progress = 100;
                }
            } else {
                $row->test_progress = 0;
            }

            $row->equipmentURL = URL::to('equipment/'.$row->equipmentURL);

            if(!$getEquipmentFeed) {
                $returnData[$row->labName]['equipment'][] = $row;
                $returnData[$row->labName]['labURL'] = $row->labURL;
                $returnData[$row->labName]['labName'] = $row->labName;
                $returnData[$row->labName]['labId'] = $row->labId;

                unset($row->labURL);
                unset($row->labName);
            } else {
                $returnData = $row;
            }
        }

        return $returnData;
    }

    public function checkToken($token)
    {
        $result = DB::table('companies__api')->where('secret', '=', $token)->first();

        if(empty($result)) {
            $result = false;
        }

        return $result;
    }
}
