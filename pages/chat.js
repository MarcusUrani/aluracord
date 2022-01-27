import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";
import Header from "../Components/Header";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMTc5NiwiZXhwIjoxOTU4ODg3Nzk2fQ.tsfta_yJ6nCUuEOSlZI6FVL1y1NIWq1P89rbfhAH-As";
const SUPABASE_URL = "https://guegqoipzieisnegctqk.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ChatPage = () => {
  const [mensagem, setMensagem] = useState("");
  const [listaMensagens, setListaMensagens] = useState([]);
  const roteamento = useRouter();
  const username = roteamento.query.user;

  const handleNovaMensagem = (novaMensagem) => {
    const mensagem = {
      texto: novaMensagem,
      de: username,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {
        setListaMensagens([data[0], ...listaMensagens]);
      });

    setMensagem("");
  };

  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data);
      });
  }, [listaMensagens]);

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://i1.wp.com/nerdizmo.uai.com.br/wp-content/uploads/sites/29/2021/05/wallpapers-do-star-wars-17.jpg?ssl=1)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaMensagens} username={username} />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
            onSubmit={(event) => {
              event.preventDefault();
              handleNovaMensagem(mensagem);
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (mensagem.length > 1) {
                    handleNovaMensagem(mensagem);
                  } else {
                    alert("A campo de mensagem deve estar preenchido");
                  }
                }
              }}
              required
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              colorVariant="dark"
              size="xs"
              type="submit"
              iconName="arrowRight"
              styleSheet={{
                backgroundColor: appConfig.theme.colors.neutrals[400],
                contrastColor: appConfig.theme.colors.neutrals["000"],
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[500],
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const MessageList = (props) => {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: "hidden",
        overflowX: "hidden",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              {/* <Button
                label="Apagar"
                styleSheet={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                  position: "relative",
                  marginLeft: "1rem",
                  top: 0,
                  right: 0,
                  padding: "3px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  handleDeletarMensagem();
                }}
              /> */}
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
};

export default ChatPage;
