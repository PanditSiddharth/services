"use client"
import { getProvidersNetwork } from '@/app/actions/referral';
import OrgChart from '@balkangraph/orgchart.js';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Moved API call to parent component
  useEffect(() => {
    if (!session?.user?._id) return;
    
    // Fetch data only once when component mounts
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getProvidersNetwork(session.user._id);
        if (res?.data) {
          const formattedData = res.data.map(provider => ({
            id: provider.id,
            pid: provider?.pid,
            name: provider?.name,
            title: `Level ${provider?.level || 0} || Downline ${provider?.totalReferrals || 0} `,
            img: provider.img,
            level: provider.level || 0,
            totalReferrals: provider?.totalReferrals || 0,
            joinDate: provider.joinDate
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching providers network:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?._id]); // Only depend on user ID

  function Orgchart(props) {
    const divRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<any>(null);
    
    useEffect(() => {
      if (divRef.current) {
        const newChart = new OrgChart(divRef.current, {
          template: "diva",
          enableSearch: false,
          nodeBinding: props.nodeBinding,
          nodes: props.nodes,
          layout: OrgChart.tree,
          orientation: OrgChart.orientation.top,
          mouseScrool: OrgChart.action.zoom,
          levelSeparation: 100,
          siblingSeparation: 40,
          subtreeSeparation: 80,
          padding: 30,
          // miniMap: true,
          collapse: {
            level: 6,
            allChildren: true
          },
          // nodeMenu: null,
        });
        setChart(newChart);
      }

      // Cleanup function
      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }, [props.nodes, props.nodeBinding]);
    
    return (
      <div 
        ref={divRef} 
        style={{ 
          height: "90vh",
          width: "100%",
          marginTop: "4px",
          border: "1px solid #eee",
          borderRadius: "5px",
          backgroundColor: "#bfffbf",
        }}
      />
    );
  }

  const nodeBinding = {
    field_0: "name",
    img_0: "img",
    field_1: "title",
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Orgchart 
      nodes={chartData}
      nodeBinding={nodeBinding} 
    />
  )
}