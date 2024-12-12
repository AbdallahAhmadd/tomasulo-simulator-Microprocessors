import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { instruction } from "../../types";


interface InstructionQueueProps {
  instructionQueue: String[];
}

export default function InstructionQueue({ instructionQueue }: InstructionQueueProps) {
  return (
    <Card>
      <CardContent>
        <List>
          {instructionQueue.map((instruction, index) => (
            <ListItem key={index}>
              <Typography variant="body1">
                {instruction}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
