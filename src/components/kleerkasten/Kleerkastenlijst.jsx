
import { useNavigate, useParams  } from 'react-router-dom';
import Error from '../Error';
import useKleerkasten from '../../api/kleerkasten';
import { Layout,Table, notification,Spin,Alert,Input,Button,Modal} from 'antd';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons';
import { useCallback, useEffect, useState, useMemo } from 'react';
const { Header, Content } = Layout;


const getFilterTekst = (text) => {
    if (!text) {
      return;
    }
  
    return `Zoekopdracht: ${text}`;
  };


export default function Kleerkastenlijst(){
    const kleerkastApi = useKleerkasten();
    const [kleerkasten, setKleerkasten] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [text, setText] = useState("");
    const [api, contextHolder] = notification.useNotification();
    const navigate= useNavigate();
    const refreshKleerkasten = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);
            const kleerkasten = await kleerkastApi.getAll();
            setKleerkasten(kleerkasten);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        refreshKleerkasten();
        }, [refreshKleerkasten]);
    const OnRow = (record) => {
        return;
    }
    const filteredItems = useMemo(() => {
        if (!query) {
          return kleerkasten;
        }
        return kleerkasten.filter((kleerkast) =>  `${kleerkast.name} ${kleerkast.location} ${kleerkast.kledingstukken.length}`.toLowerCase().includes(query.toLowerCase()));
      }, [query, kleerkasten]);
      const onDelete = useCallback(async (idToDelete) => {
        Modal.confirm({
          title: 'Weet je zeker dat je deze kleerkast wilt verwijderen?',
          content: 'Dit kan niet ongedaan worden gemaakt',
          okText: 'Ja',
          okType: 'danger',
          cancelText: 'Nee',
          onOk: async () => {
            try {
              setLoading(true);
              setError(null);
              kleerkastApi.deleteKleerkast(idToDelete);
              setKleerkasten(oldKleerkasten => oldKleerkasten.filter(({kleerkastId}) => kleerkastId !== idToDelete));
              openNotification();
            } catch (error) {
              setError(error);
            } finally {
              setLoading(false);
            }
          },
        });
      }, []);
      const openNotification = () => {
        api['success']({
            message: 'Kledingstuk is succesvol verwijderd',
              placement: 'topRight',
              duration: 3,
    
              });
    };
      
    return(
        <div className="justify-content-center">
            {contextHolder}
            <Spin spinning={loading}>
            <Layout>
                <Header style={{backgroundColor:"white"}}>
            <h1>Kleerkastenlijst</h1>
            </Header>
            <Content>
            <Input.Search
          placeholder="Zoek hier..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={(e) => setText(query)}
          style={{ marginBottom: 8, width: "50%", display: "inline-block", marginLeft: "auto", marginRight: "auto" }}
        />
        <Button style={{ float: "right", marginRight: "2.5%" }} onClick={() => { navigate(`/kleerkasten/add`) }}>
          Klik hier om een nieuwe kleerkast toe te voegen
        </Button>
        <div>{getFilterTekst(text)}</div>
            <Error error={error} />
            <Table data-cy="kledinglijst" onRow={OnRow} locale= {loading?{emptyText:"Loading"}:{emptyText:<Alert message="Er zijn nog geen kleerkasten, klik op de bovenstaande knop om er toe te voegen" type="warning" showIcon closable/>}}
            columns={[
                {
                    title: "Naam",
                    dataIndex: "name",
                    key: "name",
                    sorter: (a, b) => a.name.localeCompare(b.name),
                },
                {
                    title: "Locatie",
                    dataIndex: "location",
                    key: "location",
                    sorter: (a, b) => a.location.localeCompare(b.location),
                },
                {
                    title: "Aantal kledingstukken",
                    dataIndex: "aantalKledingstukken",
                    key: "aantalKledingstukken",
                    sorter: (a, b) => a.aantalKledingstukken - b.aantalKledingstukken,
                },
                {
                    title: '',
                    dataIndex: 'kledingstukId',
                    render: (id) => (
                        <div onClick={(event)=> event.stopPropagation()}>
                           <EditOutlined onClick={()=> {navigate(`/kleerkasten/${id}/edit`)}}/>
                            <DeleteOutlined onClick={()=> {onDelete(id)}} style={{color:"red", marginLeft:12}} data-cy="remove_kledingstuk"/>
                        </div>
                    ),
                },
                        
            ]}
            dataSource={filteredItems.map((kleerkast) => {
                return {
                    ...kleerkast,
                    key: kleerkast.id,
                    aantalKledingstukken: kleerkast.kledingstukken.length
                };
            })}
            rowKey="kleerkastId"
                style={{marginLeft:30, marginRight:30, width:"95%"}}
            
            >

            </Table>
            </Content>
            </Layout>
            </Spin>
        </div>
    );
}

    

  
