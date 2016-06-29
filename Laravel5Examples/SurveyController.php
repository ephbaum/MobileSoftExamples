<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Auth;

use App\Coupons;
use App\Survey;

use GuzzleHttp\Client;

class SurveyController extends Controller
{
     /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the Survey
     *
     * @return \Illuminate\Http\Response
     */
    public function showSurvey()
    {
        $user = Auth::user();

        $hasRedeemedCoupon = Coupons::where('redeemed_to_user_id', $user->id)->first();

        if (!$hasRedeemedCoupon) {
          // @TODO Add error messaging
          return redirect()->route('home');
        }

        $typeformUrl = $this->createTypeformSurvey();

        return view('survey.survey')->with(['user' => $user, 'typeformUrl' => $typeformUrl]);
    }


    /**
     * Accept POST of the Survey
     *
     * @return \Illuminate\Http\Response
     */
    public function submitSurvey(Request $request)
    {
        $user = Auth::user();

        $input = $request->all();
        $hasRedeemedCoupon = Coupons::where('redeemed_to_user_id', $user->id)->first();

        if (!$hasRedeemedCoupon) {
          // @TODO Add error messaging
          return redirect()->route('home');
        }

        $survey = new Survey();

        $survey->user_id = $user->id;
        $survey->answers = json_encode($input->answers);

        return view('survey.survey'); // @TODO Define success messaging
    }

    /**
     * Helper method to create survey form on the fly
     *
     * @return $url String Url of survey for view 
     */
    private function createTypeformSurvey()
    {
        $client = new Client([
          'base_uri' => 'https://api.typeform.io', 
          'headers' => ['X-API-TOKEN' => env('TYPEFORM_IO_API_KEY')]
        ]);

        $payload = [
          'title' => 'Dummy Survey',
          'fields' => [
            [
              'type' => 'opinion_scale',
              'question' => 'I am a positive person.',
              'labels' => [
                'left' => 'Strongly Disagree',
                'center' => 'Neutral',
                'right' => 'Strongly Agree'
              ]
            ],
            [
              'type' => 'opinion_scale',
              'question' => 'I anger easily.',
              'labels' => [
                'left' => 'Strongly Disagree',
                'center' => 'Neutral',
                'right' => 'Strongly Agree'
              ]
            ],
            [
              'type' => 'opinion_scale',
              'question' => 'I like turtles.',
              'labels' => [
                'left' => 'Strongly Disagree',
                'center' => 'Neutral',
                'right' => 'Strongly Agree'
              ]
            ]
          ]
        ];

        $res = $client->request('POST', '/latest/forms', ['json' => $payload]);

        if ($res->getStatusCode() !== 201) {
            abort($res->getStatusCode(), (string) $res->getBody());
        }

        $form = json_decode($res->getBody());

        $url = '';

        foreach ($form->_links as $l) {
          if ($l->rel === 'form_render') {
            $url = $l->href;
          }
        }

        return $url;
    }

}
