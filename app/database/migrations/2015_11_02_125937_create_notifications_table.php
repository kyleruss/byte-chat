<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('notifications', function(Blueprint $table)
		{	
			$table->increments('id');
			$table->string('content');
			$table->string('to', 16);
			$table->integer('type')->default(0);
			$table->boolean('unread')->default(true);
			$table->string('title');
			$table->integer('friendship_id')->unsigned()->nullable();
			$table->timestamps();
			$table->foreign('to')->references('username')->on('users')->onDelete('cascade');
			$table->foreign('friendship_id')->references('id')->on('friendships')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('notifications');
	}

}
