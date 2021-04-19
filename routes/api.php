<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['namespace' => 'Auth', 'prefix' => 'auth'], function() {
    
    Route::post('register',[RegisterController::class, 'register']);
    // Route::post('register_admin','RegisterController@register_admin');
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('payload', [AuthController::class, 'payload']);

    Route::post('forgot-password-email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('forgot-password-reset', [ResetPasswordController::class, 'reset']);
});

//middleware(['auth:api'])
Route::middleware(['auth:api'])->group(function () {
    // Email Verification Routes...
    Route::post('email/verify/{id}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
    Route::post('email/verify', [VerificationController::class, 'show'])->name('verification.notice');
    //  Rutas de negocio
});

Route::group([ 'namespace' => 'Profile','prefix'=>'profile'], function () {
    // Current user
    Route::group(['prefix' => 'current', 'middleware' => ['auth:api']], function() {
        Route::post('set-password', [ProfileController::class, 'setPassword']);
    });
});


Route::group(['namespace' => 'Api','middleware' => ['auth:api']], static function() {

    Route::resource('business', '\App\Http\Controllers\Api\BusinessController');
    Route::resource('calendar', '\App\Http\Controllers\Api\CalendarController');
    Route::resource('branch', '\App\Http\Controllers\Api\BranchController');
    Route::resource('role', '\App\Http\Controllers\Api\RoleController');
    Route::resource('user', '\App\Http\Controllers\Api\UserController');
    
    Route::get('index', [HomeController::class, 'index'])->name('home.api');

});

Route::group(['namespace' => 'Api'], static function() {
    
    Route::get('initialsetup', [HomeController::class, 'initialsetup']);

    
});
    



//llenar filtro routes
Route::group(['namespace' => 'Api\Support'], function() {
    // Route::get('/listColores', 'ColorController')->name('listColores.api');
    // Route::get('/listCategorias', 'CarCategoryController')->name('listCategorias.api');
    // Route::get('/listAnno', 'AnnoController')->name('listAnno.api');
    // Route::get('/listCategoriasVenta', 'CategorySalesController')->name('listCategoriasVenta.api');
    // Route::get('/listTipoTransmision', 'TrasmisionTypeController')->name('listTipoTransmision.api');
    // Route::get('/listTiposCombustibles', 'FuelTypeController')->name('listTiposCombustibles.api');
    // Route::get('/listPaises', 'CountryController')->name('listPaises.api');
    // Route::get('/listMarcas', 'BranchController')->name('listMarcas.api');
    // Route::get('/listEstadosTerritoriales/{id?}', 'TerritorialStateController')->name('listEstadosTerritoriales.api');
    // Route::get('/listModelosAutos/{id?}', 'CarModelController')->name('listModelosAutos.api');
    // Route::get('/listVersionesAutos', 'AutoVersionController')->name('listVersionesAutos.api');  
});




