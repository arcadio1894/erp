<?php

namespace App\Helpers;

use App\DateDimension;

class CalendarioHelper
{
    public static function buildCalendarData()
    {
        $rows = DateDimension::select('year', 'month', 'month_name', 'week_of_month')
            ->orderBy('year')
            ->orderBy('month')
            ->orderBy('week_of_month')
            ->get();

        $calendar = [];

        foreach ($rows as $row) {
            $y = $row->year;
            $m = $row->month;

            if (!isset($calendar[$y])) {
                $calendar[$y] = [
                    'months' => [],
                    'weeks'  => [],
                ];
            }

            // Mes
            $calendar[$y]['months'][$m] = $row->month_name;

            // Semanas del mes
            if (!isset($calendar[$y]['weeks'][$m])) {
                $calendar[$y]['weeks'][$m] = [];
            }
            if (!in_array($row->week_of_month, $calendar[$y]['weeks'][$m])) {
                $calendar[$y]['weeks'][$m][] = $row->week_of_month;
            }
        }

        return $calendar;
    }
}