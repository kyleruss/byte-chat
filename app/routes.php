<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


Route::get('/', ['as' => 'getHome', 'uses' => 'MasterController@getHome']);
Route::get('/index', ['as' => 'index', 'uses' => 'SocketController@index']);
Route::post('/sendmessage', ['as' => 'sendMessage', 'uses' => 'SocketController@sendMessage']);
Route::get('/writemessage', ['as' => 'writeMessage', 'uses' => 'SocketController@writeMessage']);


Route::group(['prefix' => 'user'], function()
{
	Route::post('/register', ['as' => 'postRegister', 'uses' => 'UserController@postRegister']);
	Route::post('/login', ['as' => 'postLogin', 'uses' => 'UserController@postLogin']);
	Route::get('/logout', ['as' => 'getLogout', 'uses' => 'UserController@getLogout']);
});	


Route::group(['prefix' => 'chat'], function()
{
	Route::get('/home', ['as' => 'getChatHome', 'uses' => 'ChatController@getChatHome']);
});
