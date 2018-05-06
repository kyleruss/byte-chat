<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFriendsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('friendships', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('from_user', 16);
			$table->string('to_user', 16);
			$table->timestamps();
			$table->boolean('pending');
			$table->foreign('from_user')->references('username')->on('users')->onDelete('cascade');
			$table->foreign('to_user')->references('username')->on('users')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('friendships');
	}

}
