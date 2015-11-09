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


Route::get('/error', ['as' => 'getError', 'uses' => 'MasterController@getError']);
Route::get('/', ['as' => 'getHome', 'uses' => 'MasterController@getHome']);
Route::get('/index', ['as' => 'index', 'uses' => 'SocketController@index']);
Route::post('/sendmessage', ['as' => 'sendMessage', 'uses' => 'SocketController@sendMessage']);
Route::get('/writemessage', ['as' => 'writeMessage', 'uses' => 'SocketController@writeMessage']);


Route::group(['prefix' => 'user'], function()
{
	Route::post('/register', ['as' => 'postRegister', 'uses' => 'UserController@postRegister']);
	Route::post('/login', ['as' => 'postLogin', 'uses' => 'UserController@postLogin']);
	Route::get('/logout', ['as' => 'getLogout', 'uses' => 'UserController@getLogout']);
	Route::post('/changedp', ['as' => 'postChangeDP', 'uses' => 'UserController@postChangeDP']);
});	


Route::group(['prefix' => 'chat', 'before' => 'auth'], function()
{
	Route::get('/home', ['as' => 'getChatHome', 'uses' => 'ChatController@getChatHome']);
	Route::post('/find', ['as' => 'postFindPeople', 'uses' => 'UserController@postFindPeople']);
	Route::post('/settings/update', ['as' => 'postUpdatePersonalSettings', 'uses' => 'UserController@postUpdatePersonalSettings']);
	Route::get('/settings', ['as' => 'getUserSettings', 'uses' => 'UserController@getUserSettings']);
});
