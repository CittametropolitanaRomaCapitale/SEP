import { FCC } from "@cmrc/types/FCC";
import { Box, Typography } from "@mui/material";
import EnhancedTable from "../../../components/NewTable";
import { dictionary } from "./dictionary";
import { useProtocolliResultsTable } from "./hooks/useImportProtocolliResultsTable";

export const ImportProtocolliResults: FCC<{ results?: any }> = ({
  results
}) => {

  let numImported = 0;
  for(var i=0;i<results.length;i++) {
    if (!results[i].imported) numImported += 1;
  }

  const { columns } = useProtocolliResultsTable(); 
  return (results && results.length > 0 &&
    <Box>
      <Typography variant="subtitle1" sx={{textAlign:"center"}}>
        {dictionary.get('numeroProtocolliImportati', {'number': ""+numImported})}
      </Typography>
      <EnhancedTable
        columns={columns}
        data={results}
      />
    </Box>
  );
};