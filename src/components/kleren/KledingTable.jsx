import { memo,useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {Table, Alert,} from "antd"
import {EditOutlined, DeleteOutlined} from "@ant-design/icons"
import kleerkastIcon from '../../images/wardrobe.png';

export default memo(function  KledingTable({kledingstukken,loading,onDelete,kleerkasten}) {
    const navigate = useNavigate();
    
    const OnRow = useCallback((record, rowIndex) => {
        return {
          onClick: event => {
                        navigate(`/kleren/${record.kledingstukId}`);
                        event.stopPropagation();
                    },
                    onMouseEnter: event => {
                        event.target.style.cursor = "pointer";
                        event.target.title = "Klik om kledingstuk met id " + record.kledingstukId + " te bekijken";
                        event.stopPropagation();
        
                    },
        };
      }, []);

      const columns = [
        {
          title: "Merk",
          dataIndex: "brand",
          sorter: (a, b) => a.brand.localeCompare(b.brand),
          align:"center",
            

        },
        {
        title: 'Kleur',
        dataIndex: 'color',
        sorter: (a, b) => a.color.localeCompare(b.color),
        align:"center",

    },
    {
        title: 'Type',
        dataIndex: 'type',
        sorter: (a, b) => a.type.localeCompare(b.type),
        align:"center",
      

    },
    {
        title: 'Maat',
        dataIndex: 'size',
        align:"center",
        sorter: (a, b) => a.size - b.size,

    },
];
if(!kleerkasten){
    columns.push({
        title: 'Kleerkast naam',
        dataIndex: 'kleerkastNaam',
        align:"center",
        sorter: (a, b) => a.kleerkastNaam.localeCompare(b.kleerkastNaam),
    });
    columns.push({
        title: 'Kleerkast locatie',
        dataIndex: 'kleerkastLocatie',
        align:"center",
        sorter: (a, b) => a.kleerkastLocatie.localeCompare(b.kleerkastLocatie),
    });
}
columns.push({title: 'Bewerk of verwijder',
dataIndex: 'kledingstukId',
align:"center",

render: (id) => (
    <div onClick={(event)=> event.stopPropagation()} >
       <EditOutlined onClick={()=> {navigate(`/kleren/${id}/edit`)}}/>
        <DeleteOutlined onClick={()=> {onDelete(id)}} style={{color:"red", marginLeft:12,marginRight:12}} data-cy="remove_kledingstuk"/>
        <img src={kleerkastIcon} alt="Kleerkasten" style={{width:15, height:15}} onClick={()=> {navigate(`/kleerkasten/${kledingstukken.find(kledingstuk => kledingstuk.kledingstukId===id).kleerkastId}`)}}/>
    </div>
),});
let emptytext;
if(kleerkasten){
    emptytext = <Alert message="Er zijn nog geen kledingstukken in deze kleerkast." type="warning" showIcon closable/>
}
else{
    emptytext = <Alert message="Er zijn nog geen kledingstukken, klik op de bovenstaande knop om er toe te voegen" type="warning" showIcon closable/>
}

return (
<Table data-cy="kledinglijst" onRow={OnRow} locale= {loading?{emptyText:"Loading"}:{emptyText:emptytext}}
    columns={columns}
    dataSource={kledingstukken}
    rowKey="kledingstukId"
    style={{marginLeft:30, marginRight:30, width:"95%"}}
    ></Table>
)
});