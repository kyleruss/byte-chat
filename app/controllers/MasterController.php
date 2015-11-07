<?php

class MasterController extends BaseController
{
	protected $invalid_input_message	=	'Invalid input, please check your fields';

	public function getHome()
	{
		return View::make('home');
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
