<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table)
		{
			$table->string('username', 16);
			$table->string('password', 255);
			$table->string('email');
			$table->string('name');
			$table->string('remember_token', 255);
			$table->integer('rank')->nullable()->unsigned();
			$table->string('profile_status')->nullable();
			$table->string('profile_image')->default('res/images/default_avatar.gif');
			$table->string('twitter')->nullable();
			$table->string('facebook')->nullable();
			$table->timestamps();
			$table->foreign('rank')->references('id')->on('ranks')->onDelete('set null');
			$table->primary('username');
		});	
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
	}

}
