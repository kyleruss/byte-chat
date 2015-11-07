<?php

class MasterController extends BaseController
{
	protected $invalid_input_message	=	'Invalid input, please check your fields';

	public function getHome()
	{
	/*	if(Auth::check())
			return Redirect::route('getChatHome');
else */
			return View::make('home');
	}

	public function getError()
	{
		return View::make('error');
	}

	public static function encodeReturn($status = 0, $message = 'Request failed', $data = null)
	{
		$return_message	=	['status'	=>	$status, 'message' =>	$message];

		if(isset($data))
		{
			foreach($data as $key => $value)
				$return_message[$key] = $value;
		}

		return json_encode($return_message);
	}


	public static function encodeValidator($validator)
	{
		return ['input' => $validator->messages()->toArray()];
	}
}
