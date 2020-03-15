<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Validator;
use App\Http\Requests\Login;
//use App\Repository\Repository;
use App\Http\Controllers\Traits\ApiResponseTrait;
use App\Http\Controllers\Traits\PermissionUpdateTreait;

class AuthController extends BaseController
{
    use ApiResponseTrait,PermissionUpdateTreait;
    private $repository;

    //public function __construct(Repository $userRepository){
    public function __construct(Repository $userRepository){
      //  $this->repository = $userRepository;
        $this->middleware('auth:airlock', ['except' => ['login', 'register']]);
    }

    public function me()
    {
        $auth_user = auth()->user();
        $data['user'] = $auth_user;
        $data['permission'] = $this->getAllPermissions();
        return $this->sendApiResponse(true,'Sucessfully logged in',$data,config('apiconstants.API_LOGIN_SUCCESS'));
    }

    public function getUser(){
        return auth()->user();
    }
    public function logout()
    {
        auth()->logout();
        return $this->sendApiResponse(true,'Sucessfully logged out',[],config('apiconstants.API_LOGIN_SUCCESS'));
    }

    public function login(Login $request){

        $credentials = request(['email', 'password']);
        $status = false;
        $data = [];
        $message = "User not found";
        $statusCode = config('apiconstants.API_LOGIN_FAILED');
        if ($token = auth()->attempt($credentials)) {
            $auth_id = auth()->user()->id;
            $data = $this->respondWithToken($token);
            $data['permission'] = $this->repository->setPermissionByUserId($auth_id);
            $file_name = $auth_id.".json";
            $dir = $auth_id;
            $content = json_encode($data['permission']);
            $this->filewrite($file_name,$dir,$content);
            $status = true;
            $message = 'Sucessfully logged in';
            $statusCode = config('apiconstants.API_LOGIN_SUCCESS');
        }
        return $this->sendApiResponse($status,$message,$data,$statusCode);

    }

    public function register(Request $request){

        $validator = Validator::make($request->all(),[
            'name'    => 'required',
            'email'   => 'required|email',
            'password'=> 'required|min:6',
            'confirm_password'=>'required|same:password'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Registration Error',$validator->messages(),101);
        }

        $inputData['name'] = request('name');
        $inputData['email'] = request('email');
        $inputData['password'] = request('password');
        $inserted = $this->userRepository->userAdd($inputData);

        if(!empty($inserted)){
            return $this->sendResponse($inserted,"Sucessfully inserted");
        }

    }

    protected function respondWithToken($token)
    {
        return [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
            'user'         => auth()->user(),
        ];
    }



    public function refresh()
    {
        return $this->sendResponse($this->respondWithToken(auth()->refresh()),"Successfully refreshed token");
    }

}
