<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('private_messages', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('content');
			$table->string('sender', 16)->nullable();
			$table->string('receiver', 16)->nullable();
			$table->boolean('unread')->default(true);
			$table->timestamps();
			$table->foreign('sender')->references('username')->on('users')->onDelete('set null');
			$table->foreign('receiver')->references('username')->on('users')->onDelete('set null');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('private_messages');
	}

}
