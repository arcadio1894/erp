<table class="table table-sm table-striped mb-0">
    <thead>
    <tr>
        <th>Material</th>
        <th class="text-right">Stock total</th>
        <th class="text-right">Stock mín.</th>
        <th>Estado</th>
    </tr>
    </thead>
    <tbody>
    @foreach($rows as $row)
        <tr>
            <td>{{ $row->full_name }}</td>
            <td class="text-right">{{ number_format($row->stock_total, 2) }}</td>
            <td class="text-right">{{ $row->stock_min }}</td>
            <td>
                @if($row->estado === 'desabastecido')
                    <span class="badge badge-danger">Desabastecido</span>
                @elseif($row->estado === 'por_desabastecer')
                    <span class="badge badge-warning">Por desabastecerse</span>
                @else
                    <span class="badge badge-success">Stock OK</span>
                @endif
            </td>
        </tr>
    @endforeach
    </tbody>
</table>