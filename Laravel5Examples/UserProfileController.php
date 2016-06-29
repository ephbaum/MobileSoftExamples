<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;

use Auth;

use App\User;

class UserProfileController extends Controller
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
     * Show the User Proile
     *
     * @return \Illuminate\Http\Response
     */
    public function showProfile()
    {
        $user = Auth::user();
        $user->demographics = $user->demographics;
        $user->roles = $user->roles;
        return view('user.profile', ['user' => $user]);
    }

    /**
     * Update the User Proile
     *
     * @param Request $request Http Request with Post Input
     * @return \Illuminate\Routing\Redirector
     */
    public function updateProfile(Request $request)
    {
        $input = $request->all();

        $user = Auth::user();
        $demographics = $user->demographics;

        $user->name = $input['name'];
        $user->email = $input['email'];
        $user->save();

        $demographics->telephone = $input['telephone'];
        $demographics->address = $input['address'];
        $demographics->save();

        return redirect()->route('profile');
    }
}
