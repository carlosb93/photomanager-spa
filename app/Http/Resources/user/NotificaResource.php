<?php

namespace App\Http\Resources\user;

use Illuminate\Http\Resources\Json\JsonResource;


class NotificaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        
        return parent::toArray($request);
    }
}