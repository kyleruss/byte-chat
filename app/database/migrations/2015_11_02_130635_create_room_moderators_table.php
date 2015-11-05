<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomModeratorsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('room_moderators', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('moderator', 16);
			$table->timestamps();
			$table->foreign('moderator')->references('username')->on('users')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('room_moderators');
	}

}
