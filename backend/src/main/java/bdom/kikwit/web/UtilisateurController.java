package bdom.kikwit.web;

import bdom.kikwit.Dto.UtilisateurRequestDto;
import bdom.kikwit.Dto.UtilisateurResponseDto;
import bdom.kikwit.Services.UtilisateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Utilisateur", description = "Gestion des utilisateurs")

public class UtilisateurController {
    private UtilisateurService service;

    @PostMapping(path = "/utilisateurs")
    @Operation(summary = "Creation des utilisateurs")
    public UtilisateurResponseDto save(@RequestBody UtilisateurRequestDto requestDto) throws IOException {
        return service.save((requestDto));
    }
    @GetMapping(path = "/utilisateurs")
    @Operation(summary = "Liste des utilisateurs")
    public List<UtilisateurResponseDto> list(){
        return  service.list();
    }
    @GetMapping(path = "/utilisateurs/{id}")
    @Operation(summary = "Selection d'un utilisateur")
    public UtilisateurResponseDto getUtilisateur(@PathVariable Long id){
        return  service.getOne(id);
    }
    @PatchMapping(path = "/utilisateurs/{id}")
    @Operation(summary = "Modification d'un utilisateur")
    public UtilisateurResponseDto update(@PathVariable Long id, @RequestBody UtilisateurRequestDto requestDto){
        return service.update(id,requestDto);
    }
    @DeleteMapping(path =  "/utilisateurs/{id}")
    @Operation(summary = "Suppression d'un utilisateur")
    public String delete(@PathVariable Long id){
        return  service.delete(id);
    }
}
