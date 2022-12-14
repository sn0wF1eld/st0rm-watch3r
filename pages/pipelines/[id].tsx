import {Connection, useContextProvider} from "../../components/layout/provider/Context";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
// @ts-ignore
import Graph from 'react-graph-vis'
import Modal from "../../components/modal/Modal";
import Stats from "../../components/pipelines/Stats";
import Actions from "../../components/pipelines/Actions";
import {getEdgeColor, getNodeColor, Pipeline} from "../../components/pipelines/utils/PipelinesUtils";
import ColorCodes from "../../components/pipelines/ColorCodes";
import LoadingIcon from "../../components/layout/LoadingIcon";
import StepsModal from "../../components/pipelines/StepsModal";
import {FiSettings} from "react-icons/fi";
import SystemConfigModal from "../../components/pipelines/SystemConfigModal";
import UptimeComponent from "../../components/pipelines/UptimeComponent";
import Button from "../../components/layout/Button";

export default function Pipelines() {
  const {connections} = useContextProvider()
  const [connection, setConnection] = useState({} as Connection)
  const [pipelines, setPipelines] = useState([] as Pipeline[])
  const [pipelinesToRender, setPipelinesToRender] = useState(null as any)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pipelinesState, setPipelinesState] = useState({} as any)
  const [selectedNode, setSelectedNode] = useState({} as any)
  const [selectedEdge, setSelectedEdge] = useState({} as any)
  const [isEdge, setIsEdge] = useState(false)
  const [selectedPipelineStatus, setSelectedPipelineStatus] = useState('')
  const [stopSystemModal, setStopSystemModal] = useState(false)
  const [systemStoppedModal, setSystemStoppedModal] = useState(false)
  const [systemConfigurationsModal, setSystemConfigurationsModal] = useState(false)
  const currentLink = usePathname()

  const handleSelectNode = (node: any, pipelineId: string, status: string) => {
    setIsEdge(false)
    setSelectedPipelineStatus(status)
    setOpenModal(true)
    setSelectedNode(pipelinesToRender[pipelineId].nodes.find((item: any) => item.id === node.nodes[0]))
  }

  const handleSelectEdge = (edge: any, pipelineId: string, status: string) => {
    setIsEdge(true)
    setSelectedPipelineStatus(status)
    setOpenModal(true)
    setSelectedEdge(pipelinesToRender[pipelineId].edges.find((item: any) => item.id === edge.edges[0]))
  }

  const handleCloseModal = () => {
    setIsEdge(false)
    setSelectedPipelineStatus('')
    setOpenModal(false)
    setSelectedNode({})
    setSelectedEdge({})
  }

  const handleOnStop = () => {
    setStopSystemModal(true)
  }

  const onStopSystem = () => {
    setStopSystemModal(false)

    fetch(`http://${connection?.address}/sn0wst0rm/api/1/system/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#dcd7d7"
    },
    nodes: {
      shape: 'box'
    },
    interaction: {
      zoomView: false,
      dragNodes: false,
      dragView: false,
      selectConnectedEdges: false,
    }
  };

  useEffect(() => {
    setConnection(connections.find((item: any) => currentLink?.indexOf(item.id) !== -1))
    setPipelines([])
    setLoading(true)
  }, [connections, currentLink])

  useEffect(() => {
    if (!connection) return

    const ws = new WebSocket(`ws://${connection?.address}/sn0wst0rm/api/1/pipelines/transactions/count`)

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)
      if (json) {
        setPipelinesState(json)
      }
    }

    return () => ws.close()
  }, [connection])

  useEffect(() => {
    if (!pipelines.length) return
    const pipelineAux = {}
    pipelines.forEach((p: Pipeline) => {

      const pipelineObj = p.pipeline
      const pipelineName = p.id

      let nodes: any[] = []

      let edges: any[] = []

      const getNodesAndEdges = (pline: Pipeline['pipeline']) => {
        nodes = [...nodes, {
          id: pline.name,
          label: pline.name,
          color: getNodeColor(pline.stepType),
          type: pline.stepType
        }]

        if (pline?.connectsTo?.length) {
          pline.connectsTo.forEach((item: Pipeline['pipeline']) => {
            edges = [...edges,
              {
                from: pline.name,
                to: item.name,
                length: 200,
                title: item.name,
                color: getEdgeColor(pline.splittable, pline.switchable)
              }
            ]
            getNodesAndEdges(item)
          })
        }
        return {nodes, edges}
      }

      // @ts-ignore
      // TODO: refactor into an array, create pipeline type
      pipelineAux[pipelineName] = {
        nodes: getNodesAndEdges(pipelineObj)?.nodes,
        edges: getNodesAndEdges(pipelineObj)?.edges
      }
    })

    setTimeout(() => {
      setPipelinesToRender(pipelineAux)
      setLoading(false)
    }, 200)
  }, [pipelines])

const millisecondsToDateString = (ms: number) => {
  if (ms != null) {
    let date = new Date (ms);
    let dayOfYear = date.toDateString();
    let time = date.toLocaleTimeString()

    return dayOfYear + ' ' + time;
  }

  return null;
};

  useEffect(() => {
    if (!connection?.address) return
    const interval = setInterval(() => {
      fetch(`http://${connection?.address}/sn0wst0rm/api/1/pipelines`,
        {method: 'GET', headers: {'content-type': 'application/json'}}
      ).then((res: any) => {
        res.json()
          .then((body: Pipeline[]) => {
            setSystemStoppedModal(false)
            let statusChanged = false
            if (pipelines.length && body.length) {
              body.forEach((item: Pipeline) => {
                pipelines.forEach(pip => {
                  if (item.id === pip.id) {
                    statusChanged = statusChanged || !(item.status === pip.status)
                  }
                })
              })
            }

            if (pipelines.length !== body.length || statusChanged) {
              setLoading(true)
              setPipelines([])
              setPipelinesToRender({})

              return setPipelines(body)
            }
          })
      })
        .catch(err => {
          console.log(err)
          return setSystemStoppedModal(true)
        })
    }, 5000)

    return () => clearInterval(interval)
  }, [connection, pipelines])

  if (systemStoppedModal) return (
    <Modal open={systemStoppedModal} onClose={() => setSystemStoppedModal(false)} title={'Warning'}>
      <div className={'text-red-400'}>System Stopped</div>
    </Modal>
  )
  if (loading) return <LoadingIcon/>
  return <div className={'flex flex-col p-5 ml-6 mr-6'}>
    <div className={'flex gap-10'}>
      <Button onClick={() => handleOnStop()} styles={'bg-red text-white'}>Stop
        System
      </Button>
      {stopSystemModal &&
          <Modal open={stopSystemModal} onClose={() => setStopSystemModal(false)} title={'Stop System'}>
              <div>Stopping the system will require manual restart</div>
              <div className={'flex gap-10 justify-end'}>
                  <button onClick={() => onStopSystem()}>Confirm</button>
                  <button onClick={() => setStopSystemModal(false)}>Cancel</button>
              </div>
          </Modal>}
      <button >
        <FiSettings onClick={() => setSystemConfigurationsModal(true)}/>
      </button>
      {
        systemConfigurationsModal &&
          <Modal
              open={systemConfigurationsModal}
              onClose={() => setSystemConfigurationsModal(false)}
              title={'Configurations'}
          >
              <SystemConfigModal connection={connection}/>
          </Modal>
      }
      <UptimeComponent connection={connection} />
    </div>
    {
      pipelines.map((pipeline: Pipeline) =>
        (
          <div
            className={`border-solid border-3 p-3 mt-10 ${pipeline.status === 'online' ? 'border-green-300' : 'border-red-400'}`}
            key={pipeline.id}>
            <Stats
              started={pipelinesState[pipeline.id]?.started}
              terminated={pipelinesState[pipeline.id]?.terminated}
              backPressure={pipelinesState[pipeline.id]?.backPressure}
              stoppedAt={millisecondsToDateString(pipeline.stoppedAt)}
            />
            <Graph
              key={pipeline.id}
              style={{height: "300px"}}
              options={options}
              events={{
                selectNode: (e: any) => handleSelectNode(e, pipeline.id, pipeline.status),
                selectEdge: (e: any) => handleSelectEdge(e, pipeline.id, pipeline.status)
              }}
              graph={pipelinesToRender[pipeline.id]}
            />
            <Actions
              connection={connection}
              id={pipeline.id}
              status={pipeline.status}
            />
          </div>
        ))
    }
    {openModal && !isEdge &&
        <Modal
            open={openModal}
            title={selectedNode.label}
            onClose={handleCloseModal}
            noOverlayClick={true}
        >
            <StepsModal connection={connection} step={selectedNode} isEdge={false} status={selectedPipelineStatus}/>
        </Modal>}
    {openModal && isEdge &&
        <Modal
            open={openModal}
            title={selectedEdge.title}
            onClose={handleCloseModal}
            noOverlayClick={true}
        >
            <StepsModal connection={connection} step={selectedEdge} isEdge={true} status={selectedPipelineStatus}/>
        </Modal>}
    <ColorCodes/>
  </div>
}
